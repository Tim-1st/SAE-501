import * as z from "zod";

// Récupération du formulaire de contact
const form = document.querySelector("#contact-form");

if (form) {
    // Récupération des éléments pour afficher les messages d'erreur et de succès
    const errorBox = document.querySelector("#contact-form-error");
    const successBox = document.querySelector("#contact-form-success");
    let isFormModified = false;

    // Règles de validation des champs du formulaire avec Zod
    const contactSchema = z.object({
        firstname: z.string().trim().min(1, { error: "Veuillez mettre un prénom" }),
        lastname: z.string().trim().min(1, { error: "Veuillez mettre un nom de famille" }),
        email: z.email({ error: "Veuillez mettre une adresse e-mail valide" }),
        message: z.string().trim().min(1, { error: "Veuillez mettre un message" }),
        identity: z.enum(["none", "student", "parent", "other"]),
    });

    // Fonction pour afficher les messages d'erreur
    const showErrors = (listErrors) => {
        successBox.hidden = true;
        errorBox.textContent = listErrors.join("\n");
        errorBox.hidden = false;
    };

    form.addEventListener("input", () => {
        isFormModified = true;
    });

    // Empêche la fermeture de la page si le formulaire a été modifié
    window.addEventListener("beforeunload", (e) => {
        if (isFormModified) {
            e.preventDefault();
        }
    });

    // Envoi du formulaire
    form.addEventListener("submit", async (e) => {
        // Empêche le refresh de la page lors de l'envoi du formulaire
        e.preventDefault();

        const data = Object.fromEntries(new FormData(form));

        // validation des données du formulaire avec Zod
        const result = contactSchema.safeParse(data);

        // Affichage des messages d'erreur si la validation échoue
        if (!result.success) {
            showErrors(result.error.issues.map((issue) => issue.message));
            return;
        }

        try {
            // Envoi des données du formulaire asynchrone à l'API
            const response = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });

            // Réponse du serveur en cas d'erreur, affichage des messages d'erreur
            if (!response.ok) {
                const json = await response.json();
                showErrors(json.list_errors);
                return;
            }

            // Validation du formulaire
            form.reset();
            isFormModified = false;
            errorBox.hidden = true;
            successBox.hidden = false;
        } catch {
            // Message en cas d'erreur serveur
            showErrors(["Une erreur est survenue, veuillez réessayer."]);
        }
    });
}
