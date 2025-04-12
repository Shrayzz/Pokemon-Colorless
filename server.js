import { serve } from "bun";
import path from "path";
import fs from "fs";

const mimeTypes = {
    ".js": "text/javascript",
    ".html": "text/html",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
};

const baseDir = path.join(import.meta.dir, "public", "main");

const server = serve({
    async fetch(req) {
        const url = new URL(req.url);

        const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });

        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers });
        }

        let filePath = url.pathname === "/"
            ? path.join(baseDir, "index.html")
            : path.join(baseDir, url.pathname);

        if (!fs.existsSync(filePath)) {
            return new Response("Fichier non trouvé", { status: 404, headers });
        }

        const file = Bun.file(filePath);
        const ext = path.extname(filePath);
        const mimeType = mimeTypes[ext] || "application/octet-stream";

        return new Response(file, {
            headers: {
                ...headers,
                "Content-Type": mimeType,
            },
        });
    },

    port: 8000,
});

console.log(`Server running at ${server.url.href}`);
