export interface InstagramPost {
  id: string;
  mediaType: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
  caption?: string;
  alt?: string;
}

interface InstagramFeedResponse {
  connected: boolean;
  username: string;
  items: InstagramPost[];
}

export async function buscarFeedInstagram(signal?: AbortSignal) {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    return null;
  }

  const response = await fetch(`${apiUrl}/instagram/feed`, { signal });

  if (!response.ok) {
    throw new Error("Não foi possível carregar o feed do Instagram");
  }

  return response.json() as Promise<InstagramFeedResponse>;
}
