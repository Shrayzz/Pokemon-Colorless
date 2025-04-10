import { serve } from "bun";
import path from "path";

const server = serve({
    async fetch(req) {
        const url = new URL(req.url);

        const headers = new Headers({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });

        const p = path.join(__dirname, "public", "main", url.pathname.substring(-1));
        const f = Bun.file(p);

        if (req.method === "GET" && url.pathname === "/") {
            return new Response(Bun.file(path.join(__dirname, "public", "main", "index.html")))
        }
    },
    port: 8000,
});

console.log (`Server running at ${server.url.href}`);