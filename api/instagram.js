const VERSAO_GRAPH_API = "v25.0";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ message: "Método não permitido" });
  }

  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const usuario = process.env.INSTAGRAM_USER_ID;
  const apiBaseUrl =
    process.env.INSTAGRAM_API_BASE_URL || "https://graph.facebook.com";

  if (!token || !usuario) {
    return response.status(503).json({
      message: "Feed do Instagram não configurado",
    });
  }

  try {
    const campos = [
      "id",
      "media_type",
      "media_url",
      "thumbnail_url",
      "permalink",
      "caption",
      "timestamp",
      "like_count",
      "comments_count",
    ].join(",");
    const url = new URL(
      `${apiBaseUrl.replace(/\/$/, "")}/${VERSAO_GRAPH_API}/${usuario}/media`,
    );

    url.searchParams.set("fields", campos);
    url.searchParams.set("limit", "10");

    const resultado = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resultado.ok) {
      const detalhes = await resultado.text();
      console.error("Falha na API do Instagram", resultado.status, detalhes);
      return response.status(502).json({
        message: "Feed do Instagram temporariamente indisponível",
      });
    }

    const dados = await resultado.json();
    const items = (dados.data || [])
      .map((media) => {
        const imageUrl =
          media.media_type === "VIDEO"
            ? media.thumbnail_url || media.media_url
            : media.media_url;

        if (!imageUrl || !media.permalink) return null;

        return {
          id: media.id,
          mediaType: media.media_type,
          imageUrl,
          permalink: media.permalink,
          caption: media.caption,
          timestamp: media.timestamp,
          likeCount: media.like_count || 0,
          commentsCount: media.comments_count || 0,
        };
      })
      .filter(Boolean)
      .slice(0, 10);

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600",
    );

    return response.status(200).json({
      connected: true,
      username: "competeartfestival",
      items,
    });
  } catch (error) {
    console.error("Erro ao carregar feed do Instagram", error);
    return response.status(502).json({
      message: "Feed do Instagram temporariamente indisponível",
    });
  }
}
