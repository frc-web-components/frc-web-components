export const joinPaths = (start: string, end: string) =>
  `${start.replace(/\/$/, '')}/${end.replace(/^\//, '')}`;

export function getDirname(path: string) {
  const separatorIndex = path.lastIndexOf('/');
  if (separatorIndex < 0) {
    return '';
  }
  return path.substring(0, separatorIndex);
}
