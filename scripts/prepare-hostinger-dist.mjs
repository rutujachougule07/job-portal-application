import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";

const rootDir = process.cwd();
const clientDir = path.join(rootDir, "dist", "client");
const distDir = path.join(rootDir, "dist");
const hostingerDir = path.join(rootDir, "dist-hostinger");
const zipPath = path.join(rootDir, "dist.zip");
const htaccessSource = path.join(rootDir, "public", ".htaccess");

console.log("\n🚀 [Prepare Hostinger Dist] Starting validation and deployment packaging...");

// 0. Clean stale archives in root (e.g. dist (2).zip, old dist.zip)
const staleZipPattern = /^dist(\s*\(\d+\))?\.zip$/i;
for (const file of fs.readdirSync(rootDir)) {
  if (staleZipPattern.test(file)) {
    try {
      fs.unlinkSync(path.join(rootDir, file));
      console.log(`🧹 Cleaned stale archive: ${file}`);
    } catch {
      // ignore
    }
  }
}

// 1. Verify client build directory exists
if (!fs.existsSync(clientDir)) {
  console.error("❌ Client build directory not found at:", clientDir);
  console.error("   Ensure 'vite build' completed successfully.");
  process.exit(1);
}

// 2. Verify index.html exists
const indexHtmlPath = path.join(clientDir, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ index.html not found in client build at:", indexHtmlPath);
  process.exit(1);
}

const htmlContent = fs.readFileSync(indexHtmlPath, "utf-8");

// 3. Verify CSS & JS references in generated HTML
const linkMatches = [...htmlContent.matchAll(/<link[^>]+href=["']([^"']+)["']/gi)].map((m) => m[1]);
const scriptMatches = [...htmlContent.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)].map((m) => m[1]);

console.log("🔍 Checking asset references inside generated index.html...");

const localRefs = [...linkMatches, ...scriptMatches].filter(
  (ref) => ref.startsWith("/assets/") || ref.startsWith("./assets/") || ref.startsWith("assets/")
);

let missingCount = 0;
for (const ref of localRefs) {
  const cleanRef = ref.replace(/^\.?\//, "");
  const filePath = path.join(clientDir, cleanRef);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing asset referenced in HTML: ${ref} -> Expected at ${filePath}`);
    missingCount++;
  }
}

if (missingCount > 0) {
  console.error(`❌ Build validation failed: ${missingCount} referenced assets are missing!`);
  process.exit(1);
}

console.log(`✅ All ${localRefs.length} local CSS/JS references in index.html verified successfully on disk!`);

// 4. Ensure .htaccess is in client directory
const htaccessTarget = path.join(clientDir, ".htaccess");
if (fs.existsSync(htaccessSource)) {
  fs.copyFileSync(htaccessSource, htaccessTarget);
  console.log("✅ Copied latest .htaccess to client build directory.");
}

// 5. Populate dist-hostinger directory (clean mirror ready for public_html)
if (fs.existsSync(hostingerDir)) {
  fs.rmSync(hostingerDir, { recursive: true, force: true });
}
fs.mkdirSync(hostingerDir, { recursive: true });
fs.cpSync(clientDir, hostingerDir, { recursive: true });
console.log("✅ Created clean 'dist-hostinger' directory with all deployable files.");

// 6. Synchronize ALL static files into dist root (so dist/ itself is 100% complete for Vercel or any static host)
for (const item of fs.readdirSync(clientDir)) {
  const srcPath = path.join(clientDir, item);
  const destPath = path.join(distDir, item);
  fs.cpSync(srcPath, destPath, { recursive: true, force: true });
}
console.log("✅ Mirrored complete client build (all images, assets, scripts, php, .htaccess) into 'dist/' root.");

// 7. Generate clean, standards-compliant dist.zip using JSZip
// This guarantees:
// - Standard forward slashes (/) for all directory paths (essential for Hostinger / Linux extraction)
// - Preserves hidden files (.htaccess)
// - Sets proper UNIX file permissions and attributes
console.log("📦 Creating production dist.zip for Hostinger public_html using JSZip...");
const zip = new JSZip();

function addFilesRecursively(dirPath, zipFolder) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      const subFolder = zipFolder.folder(entry.name);
      addFilesRecursively(fullPath, subFolder);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zipFolder.file(entry.name, fileData);
    }
  }
}

addFilesRecursively(hostingerDir, zip);

const zipBuffer = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 6 },
  platform: "UNIX",
});

fs.writeFileSync(zipPath, zipBuffer);
console.log("🎉 dist.zip successfully generated at:", zipPath);

// Validate dist.zip contents
const loadedZip = await JSZip.loadAsync(zipBuffer);
const zipFileNames = Object.keys(loadedZip.files);
const hasBackslash = zipFileNames.some((name) => name.includes("\\"));
const hasHtaccess = zipFileNames.includes(".htaccess");
const hasIndex = zipFileNames.includes("index.html");

if (hasBackslash) {
  console.warn("⚠️ Warning: dist.zip contains backslashes!");
} else {
  console.log("✅ dist.zip verified: 100% forward-slash (/) Linux-compatible paths.");
}
console.log(`✅ dist.zip verified: ${zipFileNames.length} entries (.htaccess: ${hasHtaccess}, index.html: ${hasIndex}).`);

// 8. Generate .vercel/output for Vercel Build Output API v3 compatibility
try {
  const vercelOutputDir = path.join(rootDir, ".vercel", "output");
  const vercelStaticDir = path.join(vercelOutputDir, "static");
  fs.mkdirSync(vercelStaticDir, { recursive: true });
  fs.cpSync(clientDir, vercelStaticDir, { recursive: true });
  fs.writeFileSync(
    path.join(vercelOutputDir, "config.json"),
    JSON.stringify(
      {
        version: 3,
        routes: [
          { handle: "filesystem" },
          { src: "/(.*)", dest: "/index.html" },
        ],
      },
      null,
      2
    )
  );
  console.log("✅ Created clean '.vercel/output' for Vercel deployment.");
} catch (e) {
  console.log("ℹ️ Notice: .vercel/output generation skipped:", e.message);
}

console.log("\n========================================================");
console.log("🎯 PRODUCTION BUILD & HOSTINGER PACKAGING COMPLETE");
console.log("📁 Upload either of the following to Hostinger public_html:");
console.log("   Option 1 (Recommended): Upload 'dist.zip' directly to public_html and extract it.");
console.log("   Option 2: Upload all files inside 'dist-hostinger/' into public_html/.");
console.log("========================================================\n");
