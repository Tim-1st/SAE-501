import mongoose, { Schema } from "mongoose";
import * as z from "zod";

import { errorRequiredMessage } from "#database/error-messages.js";

export const MessageZodSchema = z.object({
    firstname: z
        .string({
            error: errorRequiredMessage("un titre"),
        })
        .trim()
        .min(1, { error: errorRequiredMessage("un titre") }),
    lastname: z
        .string({
            error: errorRequiredMessage("un titre"),
        })
        .trim()
        .min(1, { error: errorRequiredMessage("un titre") }),
    email: z.email(),
    message: z
        .string({
            error: errorRequiredMessage("un titre"),
        })
        .trim()
        .min(1, { error: errorRequiredMessage("un titre") }),
    identity: z.enum(["none", "student", "parent", "other"]).optional(),
});

const messageSchema = new Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    identity: {
        type: String,
        enum: ["none", "student", "parent", "other"],
        required: true
    },
});

export default mongoose.model("Message", messageSchema);
