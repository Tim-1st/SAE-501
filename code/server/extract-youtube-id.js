const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/(?:embed|shorts)\/([\w-]{11})/,
    /youtube(?:-nocookie)?\.com\/watch\?(?:.*&)?v=([\w-]{11})/,
];
const extractYoutubeId = (value) => {
    if (!value) return null;
    const input = value.trim();
    // Cas 1 : l'utilisateur a mis uniquement l'id (11 caractères)
    if (/^[\w-]{11}$/.test(input)) return input;
    // Cas 2 : une URL ou une iframe complète collée : on essaie chaque modèle
    for (const pattern of patterns) {
        const match = input.match(pattern);
        if (match) return match[1];
    }
    return null;
};
export { extractYoutubeId };
