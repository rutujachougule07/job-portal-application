// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

export default defineConfig({
  vite: {
    server: {
      port: 8081,
    },
    plugins: [
      {
        name: "local-uploaded-file-resolver",
        configureServer(server) {
          server.middlewares.use("/__local_file", (req, res, next) => {
            try {
              const urlObj = new URL(req.url || "", "http://localhost");
              const rawName = urlObj.searchParams.get("name") || "";
              const safeName = path.basename(rawName.trim());
              if (!safeName) {
                res.statusCode = 400;
                res.end("Missing file name");
                return;
              }
              const home = os.homedir();
              const candidates = [
                path.join(process.cwd(), "public", "uploads", safeName),
                path.join(home, "Downloads", safeName),
                path.join(home, "Desktop", safeName),
                path.join(home, "Documents", safeName),
              ];
              const found = candidates.find((p) => fs.existsSync(p) && fs.statSync(p).isFile());
              if (!found) {
                res.statusCode = 404;
                res.end("Not found");
                return;
              }
              const ext = path.extname(found).toLowerCase();
              const mimeMap: Record<string, string> = {
                ".pdf": "application/pdf",
                ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".doc": "application/msword",
                ".png": "image/png",
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".webp": "image/webp",
                ".mp4": "video/mp4",
                ".webm": "video/webm",
                ".ogg": "video/ogg",
                ".mov": "video/quicktime",
                ".m4v": "video/mp4",
              };
              res.setHeader("Content-Type", mimeMap[ext] || "application/octet-stream");
              res.setHeader("Cache-Control", "no-store");
              fs.createReadStream(found).pipe(res);
            } catch {
              next();
            }
          });

          server.middlewares.use("/__save_uploaded_file", (req, res, next) => {
            if (req.method !== "POST") return next();
            let body = "";
            req.on("data", (chunk) => {
              body += chunk;
            });
            req.on("end", () => {
              try {
                const { fileName, dataUrl } = JSON.parse(body);
                const rawName = path.basename(String(fileName || "media").trim()).replace(/[^a-zA-Z0-9._-]/g, "_");
                const safeName = `${Date.now()}_${rawName}`;
                if (!safeName || !dataUrl || typeof dataUrl !== "string") {
                  res.statusCode = 400;
                  res.end("Invalid payload");
                  return;
                }
                const commaIdx = dataUrl.indexOf(",");
                const b64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
                const uploadDir = path.join(process.cwd(), "public", "uploads");
                if (!fs.existsSync(uploadDir)) {
                  fs.mkdirSync(uploadDir, { recursive: true });
                }
                fs.writeFileSync(path.join(uploadDir, safeName), Buffer.from(b64, "base64"));
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true, url: `/uploads/${encodeURIComponent(safeName)}` }));
              } catch (err) {
                res.statusCode = 500;
                res.end("Error saving file");
              }
            });
          });
        },
      },
    ],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  nitro: {
    preset: process.env["VERCEL"] ? "vercel" : (process.env["NITRO_PRESET"] || "vercel"),
  },
});

