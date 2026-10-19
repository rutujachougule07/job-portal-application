import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles } from "lucide-react";
import { isVideoMedia, getYouTubeEmbedUrl } from "./video-utils";
import careerTeam from "@/assets/career-team.jpg";

const DEFAULT_HERO_MEDIA = [
  "https://firebasestorage.googleapis.com/v0/b/job-portal-729b6.firebasestorage.app/o/hero_media%2F1792129049561_hero_video.mp4?alt=media&token=9b136576-8f2e-4144-8f75-532783dec98b",
  careerTeam,
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80",
];

interface DashboardHeroBannerProps {
  className?: string;
}

export const DashboardHeroBanner: React.FC<DashboardHeroBannerProps> = ({ className = "" }) => {
  const [mediaList, setMediaList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cms_heroImages");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn("Failed to parse cached hero images", e);
      }
    }
    return DEFAULT_HERO_MEDIA;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Sync real-time hero images from Firebase CMS
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const syncFromCloud = async () => {
      try {
        const { db } = await import("@/firebase");
        const { doc, onSnapshot } = await import("firebase/firestore");
        unsubscribe = onSnapshot(doc(db, "cms_settings", "landing_page"), (snap) => {
          if (snap.exists()) {
            const data: any = snap.data();
            if (Array.isArray(data.heroImages) && data.heroImages.length > 0) {
              setMediaList(data.heroImages);
              try {
                localStorage.setItem("cms_heroImages", JSON.stringify(data.heroImages));
              } catch {}
            }
          }
        }, (err) => {
          console.warn("DashboardHeroBanner: CMS live sync error", err);
        });
      } catch (e) {
        console.warn("DashboardHeroBanner: Firestore import failed", e);
      }
    };
    syncFromCloud();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const activeMedia = mediaList[currentIndex] || "";
  const isVideo = isVideoMedia(activeMedia);

  // Auto-advance for static images
  useEffect(() => {
    if (mediaList.length <= 1 || isVideo) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }, 3500);

    return () => clearTimeout(timer);
  }, [currentIndex, mediaList, isVideo]);

  const handleNext = () => {
    if (mediaList.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % mediaList.length);
    }
  };

  const handlePrev = () => {
    if (mediaList.length > 1) {
      setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
    }
  };

  if (!mediaList || mediaList.length === 0) {
    return null;
  }

  return (
    <div
      className={`group relative w-full h-44 sm:h-52 md:h-56 lg:h-60 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/50 bg-[#021D3D] select-none ${className}`}
    >
      {/* Background Media Slide */}
      <div className="absolute inset-0 z-0">
        {mediaList.map((mediaUrl, idx) => {
          const isCurrent = idx === currentIndex;
          const isItemVideo = isVideoMedia(mediaUrl);
          const ytEmbed = isItemVideo ? getYouTubeEmbedUrl(mediaUrl) : null;

          if (isItemVideo) {
            if (ytEmbed) {
              return (
                <div
                  key={mediaUrl + idx}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
                    isCurrent ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <iframe
                    src={ytEmbed}
                    title="Dashboard Featured Video"
                    className="w-full h-full object-cover border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              );
            }

            return (
              <video
                key={mediaUrl + idx}
                ref={isCurrent ? videoRef : undefined}
                src={mediaUrl}
                autoPlay
                muted={isMuted}
                loop={mediaList.length <= 1}
                playsInline
                preload="auto"
                onEnded={handleNext}
                onError={handleNext}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                  isCurrent ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
                }`}
              />
            );
          }

          return (
            <img
              key={mediaUrl + idx}
              src={mediaUrl}
              alt="REAL JOB Banner"
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                isCurrent ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
              }`}
            />
          );
        })}
      </div>

      {/* Subtle Gradient Overlays for Readability & Depth */}
      <div className="absolute inset-0 z-2 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

      {/* Top Left Tag Badge */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-black tracking-wide shadow-md">
        <Sparkles className="size-3 sm:size-3.5 text-amber-300 animate-pulse" />
        <span>REAL JOB • Feature Updates</span>
      </div>

      {/* Top Right Controls (Mute / Unmute for video) */}
      {isVideo && (
        <button
          type="button"
          onClick={() => {
            setIsMuted((prev) => {
              const next = !prev;
              if (videoRef.current) {
                videoRef.current.muted = next;
              }
              return next;
            });
          }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 size-8 sm:size-9 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-md"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4 text-emerald-400" />}
        </button>
      )}

      {/* Previous / Next Slide Controls (Visible on hover or touch) */}
      {mediaList.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-lg"
            title="Previous Slide"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-70 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-lg"
            title="Next Slide"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </>
      )}

      {/* Bottom Dots Navigation */}
      {mediaList.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {mediaList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentIndex
                  ? "w-6 h-1.5 bg-amber-400 shadow-sm"
                  : "w-1.5 h-1.5 bg-white/50 hover:bg-white"
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeroBanner;
