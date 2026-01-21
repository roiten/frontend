import Ajv from "ajv";

export function validatePresentation(presentation: unknown) {
    const ajv = new Ajv();

    const slideObjectSchema = {
        type: "object",
        properties: {
            id: { type: "string" },
            transparency: { type: "number" },
            position: {
                type: "object",
                properties: {
                    x: { type: "number" },
                    y: { type: "number" },
                },
                required: ["x", "y"],
                additionalProperties: false,
            },
            size: {
                type: "object",
                properties: {
                    width: { type: "number" },
                    height: { type: "number" },
                },
                required: ["width", "height"],
                additionalProperties: false,
            },
            type: { type: "string", enum: ["text", "image"] },
            description: { type: "string" },
            font: {
                type: "object",
                properties: {
                    family: { type: "string" },
                    color: { type: "string" },
                    size: { type: "number" },
                    weight: { type: "number" },
                    textDecoration: {
                        type: "string",
                        enum: ["strikethrough", "underline", "none"],
                    },
                    textAlign: {
                        type: "string",
                        enum: ["left", "center", "right", "justify"],
                    },
                },
                required: [
                    "family",
                    "color",
                    "size",
                    "weight",
                    "textDecoration",
                    "textAlign",
                ],
                additionalProperties: false,
            },
            source: { type: "string", nullable: true },
        },
        required: ["id", "type", "transparency", "position", "size"],
        additionalProperties: false,
    };

    const backgroundSchema = {
        type: "object",
        properties: {
            type: { type: "string", enum: ["color", "picture"] },
            color: { type: "string", nullable: true },
            source: { type: "string", nullable: true },
            transparency: { type: "number", nullable: true },
        },
        required: ["type"],
        additionalProperties: false,
    };

    const slideSchema = {
        type: "object",
        properties: {
            id: { type: "string" },
            background: backgroundSchema,
            content: {
                type: "array",
                items: slideObjectSchema,
                nullable: true,
            },
            hidden: { type: "boolean" },
            note: { type: "string" },
        },
        required: ["id", "background", "content"],
        additionalProperties: false,
    };

    const presentationSchema = {
        type: "object",
        properties: {
            meta: {
                type: "object",
                properties: {
                    title: { type: "string" },
                    author: { type: "string" },
                    presentationId: { type: "string" },
                    createdAt: { type: "number" },
                    editedAt: { type: "number" },
                },
                required: ["title", "author", "createdAt", "editedAt"],
                additionalProperties: false,
            },
            slides: {
                type: "array",
                items: slideSchema,
                minItems: 1,
            },
            selection: {
                type: "object",
                properties: {
                    currentSlide: { type: ["string", "null"] },
                    selectedObjects: {
                        type: ["array", "null"],
                        items: { type: "string" },
                        nullable: true,
                    },
                },
                required: [],
                additionalProperties: false,
            },
        },
        required: ["meta", "slides", "selection"],
        additionalProperties: false,
    };

    const validate = ajv.compile(presentationSchema);
    const valid = validate(presentation);

    if (!valid) {
        console.error("Presentation validation errors:", validate.errors);
        return false;
    }

    return true;
}
