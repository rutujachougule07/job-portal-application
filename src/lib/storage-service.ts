import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { storage } from "@/firebase";

export interface UploadResult {
  downloadUrl: string;
  fullPath: string;
  fileName: string;
  isFirebaseStorage: boolean;
}

/**
 * Uploads a File or Blob to Firebase Storage under the given folder.
 * If Firebase Storage upload succeeds, returns the permanent public download URL.
 * In case of permission/network error, gracefully falls back to local data URL so UX is never blocked.
 */
export async function uploadFileToFirebaseStorage(
  file: File | Blob,
  folder: string = "uploads",
  customFileName?: string
): Promise<UploadResult> {
  const originalName = (file as File).name || "file";
  const cleanExt = originalName.includes(".") ? originalName.split(".").pop() : "";
  const baseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
  const timestamp = Date.now();
  const finalName = customFileName || `${timestamp}_${baseName}${cleanExt ? `.${cleanExt}` : ""}`;
  const fullPath = `${folder}/${finalName}`;

  try {
    const storageRef = ref(storage, fullPath);
    const metadata = {
      contentType: file.type || "application/octet-stream",
    };

    console.log(`[FirebaseStorage] Uploading to ${fullPath}...`);
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log(`[FirebaseStorage] Upload success! Download URL:`, downloadUrl);

    return {
      downloadUrl,
      fullPath,
      fileName: originalName,
      isFirebaseStorage: true,
    };
  } catch (error) {
    console.warn(`[FirebaseStorage] Direct storage upload failed, falling back to DataURL:`, error);
    
    // Fallback to Data URL so user is never blocked
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      downloadUrl: dataUrl,
      fullPath: `local_${finalName}`,
      fileName: originalName,
      isFirebaseStorage: false,
    };
  }
}

/**
 * Uploads a base64 DataURL (e.g. from camera capture or canvas) to Firebase Storage.
 */
export async function uploadDataUrlToFirebaseStorage(
  dataUrl: string,
  folder: string = "photos",
  fileName?: string
): Promise<UploadResult> {
  if (!dataUrl || !dataUrl.startsWith("data:")) {
    return {
      downloadUrl: dataUrl,
      fullPath: "",
      fileName: fileName || "image.png",
      isFirebaseStorage: false,
    };
  }

  const timestamp = Date.now();
  const cleanName = fileName ? fileName.replace(/[^a-zA-Z0-9._-]/g, "_") : `photo_${timestamp}.png`;
  const fullPath = `${folder}/${cleanName}`;

  try {
    const storageRef = ref(storage, fullPath);
    console.log(`[FirebaseStorage] Uploading DataURL to ${fullPath}...`);
    const snapshot = await uploadString(storageRef, dataUrl, "data_url");
    const downloadUrl = await getDownloadURL(snapshot.ref);
    console.log(`[FirebaseStorage] DataURL upload success! URL:`, downloadUrl);

    return {
      downloadUrl,
      fullPath,
      fileName: cleanName,
      isFirebaseStorage: true,
    };
  } catch (error) {
    console.warn(`[FirebaseStorage] uploadDataUrl failed, keeping DataURL:`, error);
    return {
      downloadUrl: dataUrl,
      fullPath: `local_${cleanName}`,
      fileName: cleanName,
      isFirebaseStorage: false,
    };
  }
}
