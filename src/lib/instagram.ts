export interface InstagramPost {
  id: string;
  mediaType: string;
  imageUrl: string;
  permalink: string;
  timestamp: string;
  caption?: string;
  alt?: string;
  likeCount?: number;
  commentsCount?: number;
}

interface InstagramFeedResponse {
  connected: boolean;
  username: string;
  items: InstagramPost[];
}

export async function buscarFeedInstagram(signal?: AbortSignal) {
  const response = await fetch("/api/instagram", {
    signal,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar o feed do Instagram");
  }

  return response.json() as Promise<InstagramFeedResponse>;
}
