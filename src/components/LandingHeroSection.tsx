import React, { useState, useEffect } from "react";
import { isVideoMedia, getYouTubeEmbedUrl } from "./video-utils";

interface LandingHeroSectionProps {
  mediaList?: string[];
  intervalMs?: number;
}

/**
 * Landing Page Hero Section Slider
 * Displays background banners with full support for:
 * - HTML5 Background Videos (.mp4, .webm, .mov) with muted autoplay loop
 * - YouTube Videos (embedded muted looping iframe)
 * - Banner Images (.png, .jpg, .webp)
 * - Automatic smooth transition between multiple media items
 */
export const LandingHeroSection: React.FC<LandingHeroSectionProps> = ({
  mediaList = [],
  intervalMs = 6000,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Auto-slide through media items
  useEffect(() => {
    if (mediaList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [mediaList.length, intervalMs]);

  if (mediaList.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden h-[50vh] min-h-[350px] md:h-screen md:min-h-[600px] flex items-center justify-center pt-20 pb-16 md:pb-24">
      {/* Background Media Slider (Image / Video) */}
      <div className="absolute inset-0 z-0 bg-black">
        {mediaList.map((mediaUrl, index) => {
          const isVideo = isVideoMedia(mediaUrl);
          const ytEmbed = isVideo ? getYouTubeEmbedUrl(mediaUrl) : null;
          const isActive = index === currentMediaIndex;

          if (isVideo) {
            if (ytEmbed) {
              return (
                <div
                  key={mediaUrl + index}
                  className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-1000 ease-in-out ${
                    isActive ? "opacity-100 z-1" : "opacity-0"
                  }`}
                >
                  <iframe
                    src={ytEmbed}
                    title="Hero Video Background"
                    className="w-full h-full object-cover border-0 pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              );
            }

            return (
              <video
                key={mediaUrl + index}
                src={mediaUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
                }`}
              />
            );
          }

          return (
            <img
              key={mediaUrl + index}
              src={mediaUrl}
              alt="Hero Background"
              className={`absolute inset-0 h-full w-full object-cover object-[70%_20%] transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-1" : "opacity-0 pointer-events-none"
              }`}
            />
          );
        })}
      </div>
    </section>
  );
};
