// ─── Portfolio Image/Video Input Types ──────────────────────────────────────

export interface PortfolioImageInput {
  url: string;
  thumbnail?: string;
  alt?: string;
  type?: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface PortfolioVideoInput {
  type?: string;
  url: string;
  thumbnail?: string;
  title?: string;
}