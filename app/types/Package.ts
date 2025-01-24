export const PACKAGES = [
    "basic",
    "medium",
    "premium",
    "gold",
    "platinum",
    "diamond",
    "custom",
  ] as const;
  
  export type Package = (typeof PACKAGES)[number];