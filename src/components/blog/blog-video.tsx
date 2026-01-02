"use client";

import { BlogVideoBlock } from "@/strapi/blog";

interface BlogVideoProps {
  block: BlogVideoBlock;
}

// Extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  // Handle regular YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }

  // Handle YouTube live URLs: https://www.youtube.com/live/VIDEO_ID
  const liveMatch = url.match(/youtube\.com\/live\/([^#&?]*)/);
  if (liveMatch && liveMatch[1]) {
    return liveMatch[1];
  }

  return null;
}

// Convert YouTube URL to embed URL
function getYouTubeEmbedUrl(url: string): string {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    // Check if it's a live URL
    if (url.includes("/live/")) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  }
  // If we can't parse it, try to use the URL as-is (might already be an embed URL)
  return url;
}

export default function BlogVideo({ block }: BlogVideoProps) {
  // If YouTube URL, use iframe embed
  if (block.videoUrl) {
    const embedUrl = getYouTubeEmbedUrl(block.videoUrl);
    return (
      <div className="space-y-4 md:space-y-6 my-8 md:my-12">
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <iframe
            src={embedUrl}
            title={block.caption || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
        {block.caption && (
          <p className="font-manrope font-medium text-sm md:text-base leading-[140%] tracking-[-0.02em] text-black text-center">
            {block.caption}
          </p>
        )}
      </div>
    );
  }

  // If uploaded video file
  if (block.video) {
    return (
      <div className="space-y-4 md:space-y-6 my-8 md:my-12">
        <div className="relative w-full aspect-video bg-black overflow-hidden">
          <video
            src={block.video}
            controls
            className="w-full h-full object-contain"
          >
            Ваш браузер не підтримує відео тег.
          </video>
        </div>
        {block.caption && (
          <p className="font-manrope font-medium text-sm md:text-base leading-[140%] tracking-[-0.02em] text-black text-center">
            {block.caption}
          </p>
        )}
      </div>
    );
  }

  return null;
}
