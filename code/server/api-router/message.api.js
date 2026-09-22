import express from "express";
import { ZodError } from "zod";

import Message, { MessageZodSchema } from "#models/message.js";
import routeName from "#server/utils/name-route.middleware.js";

import { mapZodErrors } from "#database/error-messages.js";

const router = express.Router();
const base = "messages";

router.post(`/${base}`, routeName("message_api"), async (req, res) => {
    let listErrors = [];

    try {
        // On valide, via zod, le format des données.
        // Si ça se passe mal, zod va automatique lever une erreur
        // ce qui nous fera sortir du try et atterrir dans le catch
        // où une erreur sera revoyée sous format json
        const payloadValidated = MessageZodSchema.parse(req.body);
        const ressource = new Message(payloadValidated);
        await ressource.save();

        return res.status(201).json(ressource);
    } catch (error) {
        if (error instanceof ZodError) {
            listErrors.push(...mapZodErrors(error.issues));
        }

        return res.status(400).json({
            list_errors: [
                ...(
                    listErrors || [{ message: "Quelque chose s'est mal passé" }]
                ).map((val) => val.message),
            ],
            ressource: req.body,
            error_fields: listErrors.map((val) => val.field),
        });
    }
});

export default router;
