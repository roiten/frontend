import {
    Account,
    TablesDB,
    Storage,
    ID,
    Permission,
    Query,
    Role,
} from "appwrite";

import { client } from "./client";
import type { Editor } from "../types";

const account = new Account(client);
const tables = new TablesDB(client);
const storage = new Storage(client);

const DATABASE_ID = "6951a062003b6a5202aa";
const PRESENTATIONS_COLLECTION_ID = "result";
const VERSIONS_TABLE_ID = "presentation_versions";
const BUCKET_ID = "6951a0cc003155a2334d";

async function registerUser(email: string, password: string, username: string) {
    await account.create({
        userId: ID.unique(),
        email,
        password,
        name: username,
    });

    await account.createEmailPasswordSession({ email, password });
}

async function loginUser(email: string, password: string) {
    await account.createEmailPasswordSession({
        email,
        password,
    });
}

async function deleteCurrentSession(): Promise<void> {
    try {
        await account.deleteSession({ sessionId: "current" });
    } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
    }
}

async function createPresentationDocument(
    userId: string,
    initialData: Editor["present"],
) {
    try {
        const newDoc = await tables.createRow({
            databaseId: DATABASE_ID,
            tableId: PRESENTATIONS_COLLECTION_ID,
            rowId: ID.unique(),
            data: {
                userId,
                title: initialData.meta.title,
                content: JSON.stringify(initialData),
            },
            permissions: [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
                Permission.write(Role.user(userId)),
            ],
        });

        return {
            row: newDoc,
        };
    } catch (error) {
        console.error("Error creating presentation:", error);
        throw error;
    }
}

async function updatePresentationDocument(
    presentationId: string,
    updatedData: Editor["present"],
) {
    try {
        const response = await tables.updateRow({
            databaseId: DATABASE_ID,
            tableId: PRESENTATIONS_COLLECTION_ID,
            rowId: presentationId,
            data: {
                title: updatedData.meta.title || "Untitled Presentation",
                content: JSON.stringify(updatedData),
            },
        });

        return {
            row: response,
        };
    } catch (error) {
        console.error("Error updating presentation:", error);
        throw error;
    }
}

async function getPresentationDocumentsByUserId(userId: string) {
    try {
        const response = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: PRESENTATIONS_COLLECTION_ID,
            queries: [Query.equal("userId", userId)],
        });
        return response.total > 0 ? response.rows : null;
    } catch (error) {
        console.error("Error fetching docs:", error);
        throw error;
    }
}

async function getPresentationDocumentById(presentationId: string) {
    try {
        const response = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: PRESENTATIONS_COLLECTION_ID,
            queries: [Query.equal("$id", presentationId)],
        });
        return response.total > 0 ? response.rows[0] : null;
    } catch (error) {
        console.error("Error fetching doc:", error);
        throw error;
    }
}

async function loadAlienURL(url: string) {
    try {
        let dataUrl: string;

        try {
            const response = await fetch(url, { mode: "cors" });
            if (!response.ok) throw new Error("Failed to fetch with CORS");
            const blob = await response.blob();

            dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            console.warn("CORS failed, trying proxy...", err);
            throw new Error(
                "Не удалось скачать изображение напрямую из-за CORS. Используй сервер-прокси или Appwrite Function",
            );
        }

        const file = base64ToFile(dataUrl, `img-${Date.now()}.png`);
        const uploaded = await storage.createFile({
            bucketId: BUCKET_ID,
            fileId: ID.unique(),
            file,
        });

        return storage.getFileView({
            bucketId: BUCKET_ID,
            fileId: uploaded.$id,
        });
    } catch (error) {
        console.error("Error loading alien URL:", error);
        throw error;
    }
}

async function sendMedia(data: string) {
    const file = base64ToFile(data, `img-${Date.now()}.png`);

    const uploaded = await storage.createFile({
        bucketId: BUCKET_ID,
        fileId: ID.unique(),
        file,
    });

    return storage.getFileView({ bucketId: BUCKET_ID, fileId: uploaded.$id });
}

function base64ToFile(dataUrl: string, filename: string): File {
    const [header, base64] = dataUrl.split(",");

    if (!header || !base64) {
        throw new Error("Invalid data URL");
    }

    const match = header.match(/data:(.*?);/);
    if (!match) {
        throw new Error("Invalid MIME header");
    }

    const mime = match[1];
    const bstr = atob(base64);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
        u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
}

async function getCurrentUser() {
    try {
        return await account.get();
    } catch {
        return null;
    }
}

async function createPresentationVersion(
    presentationId: string,
    data: { meta: any; slides: any },
    userId: string,
    label?: string,
) {
    return tables.createRow({
        databaseId: DATABASE_ID,
        tableId: VERSIONS_TABLE_ID,
        rowId: ID.unique(),
        data: {
            presentationId,
            content: JSON.stringify(data),
            userId: userId,
            label: label ?? null,
        },
        permissions: [
            Permission.read(Role.user(userId)),
            Permission.read(Role.any()),
        ],
    });
}

async function getDocumentVersionsByUserId(
    presentationId: string,
    userId: string,
) {
    try {
        const response = await tables.listRows({
            databaseId: DATABASE_ID,
            tableId: VERSIONS_TABLE_ID,
            queries: [
                Query.equal("userId", userId),
                Query.equal("presentationId", presentationId),
            ],
        });
        return response.total > 0 ? response.rows : null;
    } catch (error) {
        console.error("Error fetching docs:", error);
        throw error;
    }
}

export {
    getPresentationDocumentById,
    getPresentationDocumentsByUserId,
    updatePresentationDocument,
    createPresentationDocument,
    createPresentationVersion,
    deleteCurrentSession,
    loginUser,
    registerUser,
    getCurrentUser,
    sendMedia,
    loadAlienURL,
    getDocumentVersionsByUserId,
};
