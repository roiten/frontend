import {
    Account,
    Databases,
    Storage,
    ID,
    Permission,
    Query,
    Role,
} from "appwrite";

import { client } from "./client";
import type { Editor, Image } from "../types";

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = "6936e8660028641c3f2f";
const PRESENTATIONS_COLLECTION_ID = "result";
const BUCKET_ID = "6935aeb30015249b4b34";

async function getCurrentUser() {
    try {
        return await account.get();
    } catch {
        return null;
    }
}

async function registerUser(email: string, password: string, username: string) {
    return await account.create(ID.unique(), email, password, username);
}

async function loginUser(email: string, password: string) {
    return await account.createEmailSession(email, password);
}

async function deleteCurrentSession() {
    try {
        await account.deleteSession("current");
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
        const cloned = structuredClone(initialData);
        await handleMedia(cloned);

        const newDoc = await databases.createDocument(
            DATABASE_ID,
            PRESENTATIONS_COLLECTION_ID,
            ID.unique(),
            {
                userId,
                title: cloned.meta.title,
                content: JSON.stringify(cloned),
            },
            [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId)),
                Permission.write(Role.user(userId)),
            ],
        );

        return {
            document: newDoc,
            processedData: cloned,
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
        const cloned = structuredClone(updatedData);
        await handleMedia(cloned);

        const response = await databases.updateDocument(
            DATABASE_ID,
            PRESENTATIONS_COLLECTION_ID,
            presentationId,
            {
                title: cloned.meta.title || "Untitled Presentation",
                content: JSON.stringify(cloned),
            },
        );

        return {
            document: response,
            processedData: cloned,
        };
    } catch (error) {
        console.error("Error updating presentation:", error);
        throw error;
    }
}

async function getPresentationDocumentsByUserId(userId: string) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PRESENTATIONS_COLLECTION_ID,
            [Query.equal("userId", userId)],
        );
        return response.total > 0 ? response.documents : null;
    } catch (error) {
        console.error("Error fetching docs:", error);
        throw error;
    }
}

async function getPresentationDocumentById(presentationId: string) {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            PRESENTATIONS_COLLECTION_ID,
            [Query.equal("$id", presentationId)],
        );
        return response.total > 0 ? response.documents[0] : null;
    } catch (error) {
        console.error("Error fetching doc:", error);
        throw error;
    }
}

function checkLocalMedia(data: Editor["present"]): Image[] {
    const local: Image[] = [];

    for (const slide of data.slides) {
        for (const obj of slide.content) {
            if (obj.type === "image" && obj.source.startsWith("data:")) {
                local.push(obj as Image);
            }
        }
    }

    return local;
}

async function uploadImage(image: Image): Promise<string> {
    const file = base64ToFile(image.source, `img-${Date.now()}.png`);
    const uploaded = await storage.createFile(BUCKET_ID, ID.unique(), file);
    return uploaded.$id;
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

async function handleMedia(data: Editor["present"]) {
    const localMedia = checkLocalMedia(data);

    for (const img of localMedia) {
        const fileId = await uploadImage(img);
        const url = storage.getFileView(BUCKET_ID, fileId).href;
        img.source = url;
    }

    return data;
}

export {
    getPresentationDocumentById,
    getPresentationDocumentsByUserId,
    updatePresentationDocument,
    createPresentationDocument,
    deleteCurrentSession,
    loginUser,
    registerUser,
    getCurrentUser,
};
