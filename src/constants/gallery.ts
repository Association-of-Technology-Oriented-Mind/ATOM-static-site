// Single source of truth for gallery images.
// Vite resolves these at build time into hashed asset URLs, so they survive
// production builds — unlike the raw "/src/assets/..." strings used previously,
// which 404 because dist/ has no src/ directory.
export const galleryImages: string[] = Object.entries(
  import.meta.glob("../assets/PHOTOS/*.{webp,gif,GIF}", {
    eager: true,
    query: "?url",
    import: "default",
  }) as Record<string, string>,
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);
