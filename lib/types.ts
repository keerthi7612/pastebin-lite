export interface Paste {
  content: string;
  max_views?: number;
  remaining_views?: number;
}

export interface CreatePasteRequest {
  content: string;
  max_views?: number;
}

export interface CreatePasteResponse {
  id: string;
  url: string;
}

export interface GetPasteResponse {
  content: string;
  remaining_views: number | null;
}
