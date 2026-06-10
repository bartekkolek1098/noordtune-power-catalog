const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const basePath =
  configuredBasePath && configuredBasePath !== "/"
    ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
    : "";

export function sitePath(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${normalized}` || "/";
}

export function assetPath(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return sitePath(path);
}
