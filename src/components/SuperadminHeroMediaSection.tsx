import React, { useState } from "react";
import {
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { isVideoMedia, getYouTubeEmbedUrl, getVideoDurationFromFile } from "./video-utils";

interface SuperadminHeroMediaSectionProps {
  heroImages: string[];
  setHeroImages: React.Dispatch<React.SetStateAction<string[]>>;
}

/**
 * Super Admin Hero Banner Media Section (Images & Videos)
 * Allows Super Administrators to:
 * 1. Upload background videos (.mp4, .webm, .mov)
 * 2. Add video by external link / YouTube URL
 * 3. Upload banner images (.png, .jpg, .webp) with auto WebP compression
 * 4. Preview looping video or image with media badges
 * 5. Edit / Replace existing media or Remove
 */
export const SuperadminHeroMediaSection: React.FC<SuperadminHeroMediaSectionProps> = ({
  heroImages,
  setHeroImages,
}) => {
  const [videoUploading, setVideoUploading] = useState(false);
  const [showVideoUrlModal, setShowVideoUrlModal] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState("");

  // Handler for uploading image with WebP canvas compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL("image/webp", 0.5);
          setHeroImages((prev) => [...prev, compressedBase64]);
          toast.success("✅ Image added! Remember to save settings.");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for uploading video (.mp4, .webm, etc.)
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      toast.error("Video file is too large! Please upload a clip under 150MB or use a Video URL.");
      return;
    }

    const duration = await getVideoDurationFromFile(file);
    if (duration > 61) {
      toast.error(`❌ व्हिडिओ खूप मोठा आहे (${Math.round(duration)} सेकंद)! व्हिडिओ कमाल १ मिनिट (६० सेकंद) चाच असावा.`);
      if (e.target) e.target.value = "";
      return;
    }

    setVideoUploading(true);
    const toastId = toast.loading("Uploading hero banner video to cloud... Please wait.");

    try {
      // 1. Upload to Firebase Storage so all devices/Vercel get it
      try {
        const { uploadFileToFirebaseStorage } = await import("@/lib/storage-service");
        const uploadRes = await uploadFileToFirebaseStorage(file, "hero_media");
        if (uploadRes?.downloadUrl && uploadRes.isFirebaseStorage) {
          setHeroImages((prev) => [...prev, uploadRes.downloadUrl]);
          toast.success("✅ Video uploaded to cloud! Click 'Save Landing Page Settings'.", { id: toastId });
          setVideoUploading(false);
          return;
        }
      } catch (cloudErr) {
        console.warn("Direct Firebase Storage upload error, falling back:", cloudErr);
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await fetch("/__save_uploaded_file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, dataUrl }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.url) {
              setHeroImages((prev) => [...prev, data.url]);
              toast.success("✅ Video uploaded successfully! Click 'Save Landing Page Settings'.", { id: toastId });
              setVideoUploading(false);
              return;
            }
          }

          // Fallback if local storage upload middleware is unavailable
          if (file.size < 4 * 1024 * 1024) {
            setHeroImages((prev) => [...prev, dataUrl]);
            toast.success("✅ Video attached! Click 'Save Landing Page Settings'.", { id: toastId });
          } else {
            toast.error("Video couldn't be saved locally. You can use 'Add Video by URL'.", { id: toastId });
          }
        } catch (uploadErr) {
          console.error("Upload error:", uploadErr);
          toast.error("Failed to upload video file.", { id: toastId });
        } finally {
          setVideoUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error("Error reading video file", { id: toastId });
      setVideoUploading(false);
    }
  };

  // Handler for editing/replacing existing media item
  const handleEditMedia = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    isVideo: boolean
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isVideo) {
      const duration = await getVideoDurationFromFile(file);
      if (duration > 61) {
        toast.error(`❌ व्हिडिओ खूप मोठा आहे (${Math.round(duration)} सेकंद)! व्हिडिओ कमाल १ मिनिट (६० सेकंद) चाच असावा.`);
        if (e.target) e.target.value = "";
        return;
      }
      const toastId = toast.loading("Updating video in cloud...");

      // 1. Upload to Firebase Storage
      try {
        const { uploadFileToFirebaseStorage } = await import("@/lib/storage-service");
        const uploadRes = await uploadFileToFirebaseStorage(file, "hero_media");
        if (uploadRes?.downloadUrl && uploadRes.isFirebaseStorage) {
          setHeroImages((prev) => {
            const copy = [...prev];
            copy[index] = uploadRes.downloadUrl;
            return copy;
          });
          toast.success("✅ Video updated in cloud! Click 'Save Landing Page Settings'.", { id: toastId });
          return;
        }
      } catch (cloudErr) {
        console.warn("Direct Firebase Storage upload error:", cloudErr);
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const dataUrl = reader.result as string;
          const res = await fetch("/__save_uploaded_file", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, dataUrl }),
          });
          const data = await res.json();
          if (data?.url) {
            setHeroImages((prev) => {
              const copy = [...prev];
              copy[index] = data.url;
              return copy;
            });
            toast.success("✅ Video updated! Click 'Save Landing Page Settings'.", { id: toastId });
          } else if (file.size < 4 * 1024 * 1024) {
            setHeroImages((prev) => {
              const copy = [...prev];
              copy[index] = dataUrl;
              return copy;
            });
            toast.success("✅ Video updated! Click 'Save Landing Page Settings'.", { id: toastId });
          }
        } catch {
          toast.error("Failed to update video", { id: toastId });
        }
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/webp", 0.5);
          setHeroImages((prev) => {
            const copy = [...prev];
            copy[index] = compressedBase64;
            return copy;
          });
          toast.success("✅ Image updated! Click 'Save Landing Page Settings'.");
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for adding video by URL / YouTube link
  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) {
      toast.error("Please enter a valid video link or YouTube URL.");
      return;
    }
    setHeroImages((prev) => [...prev, videoUrlInput.trim()]);
    setVideoUrlInput("");
    setShowVideoUrlModal(false);
    toast.success("✅ Video URL added! Click 'Save Landing Page Settings'.");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E0E8F5] shadow-sm">
      {/* Header and Add Video by URL toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-sm font-black text-[#063B78] flex items-center gap-2">
            <span>Hero Banner Media (Images & Videos)</span>
            <span className="text-[11px] font-bold bg-[#EBF1F8] text-[#063B78] px-2 py-0.5 rounded-full">
              {heroImages.length} items
            </span>
          </h4>
          <p className="text-[11px] text-[#5B6B7F] mt-0.5">
            Upload images or background videos (.mp4, .webm) for the main landing page hero section.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowVideoUrlModal(!showVideoUrlModal)}
          className="self-start sm:self-auto text-xs font-bold text-[#063B78] hover:text-[#082F63] bg-[#F8FAFF] hover:bg-[#E0E8F5] border border-[#DCE5F0] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <LinkIcon className="size-3.5 text-blue-600" />
          {showVideoUrlModal ? "Close Video URL" : "+ Add Video by URL"}
        </button>
      </div>

      {/* Video URL Input Dropdown / Modal */}
      {showVideoUrlModal && (
        <div className="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex flex-col sm:flex-row items-center gap-3 animate-in fade-in">
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-[#063B78] mb-1">
              Enter Video Link / Direct URL or YouTube
            </label>
            <input
              type="url"
              placeholder="e.g. https://example.com/banner.mp4 or /uploads/video.mp4"
              className="w-full h-9 px-3 bg-white border border-blue-200 rounded-lg text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={videoUrlInput}
              onChange={(e) => setVideoUrlInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddVideoUrl();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleAddVideoUrl}
              className="bg-[#063B78] hover:bg-[#082F63] text-white text-xs font-bold h-9 px-4 rounded-lg transition-colors shadow-xs"
            >
              Add Video
            </button>
            <button
              type="button"
              onClick={() => setShowVideoUrlModal(false)}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-bold h-9 px-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Media Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {heroImages.map((mediaUrl, i) => {
          const isVideo = isVideoMedia(mediaUrl);
          const ytEmbed = isVideo ? getYouTubeEmbedUrl(mediaUrl) : null;
          return (
            <div key={i} className="flex flex-col gap-2">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-[#DCE5F0] bg-black/5 flex items-center justify-center">
                {isVideo ? (
                  <>
                    {ytEmbed ? (
                      <iframe
                        src={ytEmbed}
                        title={`Banner Video ${i}`}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    ) : (
                      <video
                        src={mediaUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2 left-2 bg-black/75 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-sm backdrop-blur-xs">
                      <Video className="size-3" /> VIDEO
                    </span>
                  </>
                ) : (
                  <>
                    <img src={mediaUrl} alt={`Banner ${i}`} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/75 text-blue-300 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-sm backdrop-blur-xs">
                      <ImageIcon className="size-3" /> IMAGE
                    </span>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <label className="cursor-pointer flex-1 flex items-center justify-center bg-[#F8FAFF] hover:bg-[#E0E8F5] text-[#063B78] border border-[#DCE5F0] text-xs font-bold py-1.5 rounded-lg transition-colors gap-1">
                  {isVideo ? <Video className="size-3 text-emerald-600" /> : <ImageIcon className="size-3 text-blue-600" />}
                  <span>{isVideo ? "Edit Video" : "Edit Image"}</span>
                  <input
                    type="file"
                    accept={isVideo ? "video/mp4,video/webm,video/ogg,video/quicktime,video/*" : "image/*"}
                    className="hidden"
                    onChange={(e) => handleEditMedia(e, i, isVideo)}
                  />
                </label>
                <button
                  type="button"
                  className="flex-1 h-8 text-xs border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-lg transition-colors"
                  onClick={() => {
                    const newImages = [...heroImages];
                    newImages.splice(i, 1);
                    setHeroImages(newImages);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        {/* Add Image Card */}
        <label className="border-2 border-dashed border-[#DCE5F0] hover:border-[#063B78] rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFF] hover:bg-[#E0E8F5]/50 group">
          <div className="size-9 rounded-full bg-blue-50 text-[#063B78] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-2xs">
            <ImageIcon className="size-4" />
          </div>
          <span className="text-[#063B78] font-bold text-xs sm:text-sm">+ Add Image</span>
          <span className="text-[10px] text-[#5B6B7F] mt-0.5 px-2 text-center">PNG, JPG, WebP</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>

        {/* Add Video Card */}
        <label
          className={`border-2 border-dashed border-emerald-200 hover:border-emerald-600 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors bg-emerald-50/40 hover:bg-emerald-50/80 group ${
            videoUploading ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <div className="size-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-2xs">
            {videoUploading ? (
              <Loader2 className="size-4 animate-spin text-emerald-700" />
            ) : (
              <Video className="size-4" />
            )}
          </div>
          <span className="text-emerald-800 font-bold text-xs sm:text-sm">
            {videoUploading ? "Uploading..." : "+ Add Video"}
          </span>
          <span className="text-[10px] text-emerald-600 mt-0.5 px-2 text-center">MP4, WebM, MOV</span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
            className="hidden"
            disabled={videoUploading}
            onChange={handleVideoUpload}
          />
        </label>
      </div>
    </div>
  );
};
