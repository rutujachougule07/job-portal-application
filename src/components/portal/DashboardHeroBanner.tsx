import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { isVideoMedia, getYouTubeEmbedUrl } from "@/components/video-utils";

interface DashboardHeroBannerProps {
  role?: "seeker" | "employer";
}

const DEFAULT_LANDING_MEDIA = [
  "https://firebasestorage.googleapis.com/v0/b/job-portal-729b6.firebasestorage.app/o/hero_media%2F1792129049561_hero_video.mp4?alt=media&token=9b136576-8f2e-4144-8f75-532783dec98b",
  "/dashboard_banner_hero.jpg",
  "/dashboard_banner_employer.jpg",
];

export function DashboardHeroBanner({ role = "seeker" }: DashboardHeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync landing page banner videos & images from LocalStorage and Firestore Cloud
  const [landingMedia, setLandingMedia] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("cms_heroImages");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return DEFAULT_LANDING_MEDIA;
  });

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const syncFromFirestore = async () => {
      try {
        const { db } = await import("@/firebase");
        const { doc, onSnapshot } = await import("firebase/firestore");
        unsubscribe = onSnapshot(doc(db, "cms_settings", "landing_page"), (snap) => {
          if (snap.exists()) {
            const data: any = snap.data();
            if (Array.isArray(data.heroImages) && data.heroImages.length > 0) {
              setLandingMedia(data.heroImages);
              try {
                localStorage.setItem("cms_heroImages", JSON.stringify(data.heroImages));
              } catch {}
            }
          }
        });
      } catch (e) {
        console.error("Dashboard banner live sync error:", e);
      }
    };
    syncFromFirestore();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const totalSlides = landingMedia.length > 0 ? landingMedia.length : DEFAULT_LANDING_MEDIA.length;
  const mediaList = landingMedia.length > 0 ? landingMedia : DEFAULT_LANDING_MEDIA;
  const currentMediaUrl = mediaList[currentSlide % totalSlides] || mediaList[0];
  const isVideo = isVideoMedia(currentMediaUrl);
  const ytEmbed = isVideo ? getYouTubeEmbedUrl(currentMediaUrl) : null;

  // Auto advance every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 7000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] lg:h-[340px] rounded-3xl overflow-hidden bg-slate-900 shadow-md border border-slate-200/80 group select-none">
      
      {/* Full-bleed Video / Image Banner */}
      <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          ytEmbed ? (
            <iframe
              src={ytEmbed}
              title="Banner Video"
              className="w-full h-full object-cover border-0 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <video
              ref={videoRef}
              key={currentMediaUrl}
              src={currentMediaUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center"
              onLoadedData={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
            />
          )
        ) : (
          <img
            key={currentMediaUrl}
            src={currentMediaUrl}
            alt="Dashboard Banner"
            className="w-full h-full object-cover object-center transition-all duration-500"
          />
        )}
      </div>

      {/* Audio Mute / Unmute Button (Shown only when active slide is a video) */}
      {isVideo && !ytEmbed && (
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-4 right-4 size-9 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm flex items-center justify-center transition-all z-20 cursor-pointer shadow-lg border border-white/20"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
          title={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="size-4.5" /> : <Volume2 className="size-4.5" />}
        </button>
      )}

      {/* Left Slider Arrow Button */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 z-20 cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="size-5" />
      </button>

      {/* Right Slider Arrow Button */}
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 z-20 cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Pagination Dots at Bottom Center */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
        {mediaList.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              currentSlide === idx
                ? "w-6 h-2 bg-[#FFC400]"
                : "w-2 h-2 bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
