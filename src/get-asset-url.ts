export default function getAssetUrl(relativePath: string): string {
  const origin = import.meta.url ? new URL(import.meta.url).origin : '';
  return `${origin}/assets/${relativePath}`;
}
