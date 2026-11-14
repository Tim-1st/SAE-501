import express from "express";

import { extractYoutubeId } from "#server/extract-youtube-id.js";
import routeName from "#server/utils/name-route.middleware.js";
import parseManifest from "#server/utils/parse-manifest.js";

const router = express.Router();

router.use(async (_req, res, next) => {
    const originalRender = res.render;
    res.render = async function (view, local, callback) {
        const manifest = {
            manifest: await parseManifest("frontend.manifest.json"),
        };

        const args = [view, { ...local, ...manifest }, callback];
        originalRender.apply(this, args);
    };

    next();
});

router.get("/", routeName("homepage"), async (req, res) => {
    const queryParams = new URLSearchParams(req.query).toString();
    let list_articles = {};
    try {
        const response = await fetch(`${res.locals.base_url}/api/articles?${queryParams}&is_active=true`);
        list_articles = await response.json();
    } catch (_error) {}

    res.render("pages/front-end/index.njk", { list_articles });
});

// "(.html)?" makes ".html" optional in the url
router.get("/a-propos(.html)?", routeName("about"), async (_req, res) => {
    let result = {};
    try {
        result = await fetch(`${res.locals.base_url}/api/saes?per_page=9`);
    } catch (_error) {}

    res.render("pages/front-end/about.njk", {
        list_saes: result.data,
    });
});

// Détail d'un article
router.get("/articles/:id", routeName("article"), async (req, res, next) => {
    let article = null;
    try {
        const response = await fetch(`${res.locals.base_url}/api/articles/${req.params.id}`);
        article = await response.json();
    } catch (_error) {}

    // Article introuvable (id inconnu, erreur de l'API) : on passe à la route suivante (404)
    if (!article?._id) {
        return next();
    }

    res.render("pages/front-end/article.njk", {
        article,
        videoId: extractYoutubeId(article.yt_video_id),
    });
});

export default router;
