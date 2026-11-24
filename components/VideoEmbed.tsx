import React from 'react';
import { ExternalLink, PlayCircle } from 'lucide-react';

interface VideoEmbedProps {
  youtubeUrl?: string;
  mealTitle: string;
}

function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').trim() || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      const vParam = parsed.searchParams.get('v');
      if (vParam) return vParam;
      const segments = parsed.pathname.split('/');
      const embedIdx = segments.indexOf('embed');
      if (embedIdx !== -1 && segments[embedIdx + 1]) {
        return segments[embedIdx + 1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoEmbed({ youtubeUrl, mealTitle }: VideoEmbedProps) {
  if (!youtubeUrl) return null;

  const videoId = extractYouTubeId(youtubeUrl);

  return (
    <section
      aria-labelledby="video-heading"
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs transition-colors dark:border-stone-800 dark:bg-stone-900 sm:p-6 print:hidden"
    >
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <PlayCircle className="h-5 w-5 text-orange-600" aria-hidden="true" />
          <div>
            <h2 id="video-heading" className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
              Video Tutorial
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">Step-by-step visual cooking guide</p>
          </div>
        </div>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-700 transition-colors hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
        >
          <span>Open in YouTube</span>
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {videoId ? (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-stone-200 bg-stone-950 dark:border-stone-800">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={`${mealTitle} video tutorial`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-800 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
        >
          <span>Watch tutorial on YouTube</span>
          <ExternalLink className="h-4 w-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}