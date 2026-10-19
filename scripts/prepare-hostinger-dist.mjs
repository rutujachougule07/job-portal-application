import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const clientDir = path.join(rootDir, "dist", "client");
const distDir = path.join(rootDir, "dist");
const hostingerDir = path.join(rootDir, "dist-hostinger");
const zipPath = path.join(rootDir, "dist.zip");
const htaccessSource = path.join(rootDir, "public", ".htaccess");

console.log("\n🚀 [Prepare Hostinger Dist] Starting validation and deployment packaging...");

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
if (!fs.existsSync(htaccessTarget) && fs.existsSync(htaccessSource)) {
  fs.copyFileSync(htaccessSource, htaccessTarget);
  console.log("✅ Copied .htaccess to client build directory.");
}

// 5. Populate dist-hostinger directory (clean mirror ready for public_html)
if (fs.existsSync(hostingerDir)) {
  fs.rmSync(hostingerDir, { recursive: true, force: true });
}
fs.mkdirSync(hostingerDir, { recursive: true });
fs.cpSync(clientDir, hostingerDir, { recursive: true });
console.log("✅ Created clean 'dist-hostinger' directory with all deployable files.");

// 6. Also sync index.html, .htaccess and assets directly to dist root so dist/ itself is valid
fs.copyFileSync(indexHtmlPath, path.join(distDir, "index.html"));
if (fs.existsSync(htaccessTarget)) {
  fs.copyFileSync(htaccessTarget, path.join(distDir, ".htaccess"));
}
const distAssetsDir = path.join(distDir, "assets");
const clientAssetsDir = path.join(clientDir, "assets");
if (fs.existsSync(clientAssetsDir)) {
  fs.cpSync(clientAssetsDir, distAssetsDir, { recursive: true });
  console.log("✅ Mirrored assets to dist/assets for flat root compatibility.");
}

// 7. Generate clean dist.zip directly containing the files of dist-hostinger
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

console.log("📦 Creating production dist.zip for Hostinger public_html...");
try {
  // Use PowerShell to archive the files inside dist-hostinger including hidden files (.htaccess)
  execSync(
    `powershell -NoProfile -Command "Get-ChildItem -Path '${hostingerDir}' -Force | Compress-Archive -DestinationPath '${zipPath}' -Force"`,
    { stdio: "inherit" }
  );
  console.log("🎉 dist.zip successfully generated at:", zipPath);
} catch (err) {
  console.error("⚠️ Failed to generate zip with PowerShell:", err.message);
}

console.log("\n========================================================");
console.log("🎯 PRODUCTION BUILD & HOSTINGER PACKAGING COMPLETE");
console.log("📁 Upload either of the following to Hostinger public_html:");
console.log("   Option 1 (Recommended): Upload 'dist.zip' directly to public_html and extract it.");
console.log("   Option 2: Upload all files inside 'dist-hostinger/' into public_html/.");
console.log("========================================================\n");
