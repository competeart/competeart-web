import { useEffect, useState } from "react";
import { ArrowUpRight, Images, Instagram, Play } from "lucide-react";
import { INSTAGRAM_FALLBACK } from "../../data/instagramFallback";
import { buscarFeedInstagram, type InstagramPost } from "../../lib/instagram";

const PERFIL_INSTAGRAM = "https://www.instagram.com/competeartfestival/";

function formatarData(timestamp: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(new Date(timestamp))
    .replace(".", "")
    .toUpperCase();
}

function IconeTipoMidia({ tipo }: { tipo: string }) {
  if (tipo === "VIDEO" || tipo === "REELS") {
    return <Play aria-hidden="true" size={15} fill="currentColor" />;
  }

  if (tipo === "CAROUSEL_ALBUM") {
    return <Images aria-hidden="true" size={16} />;
  }

  return <Instagram aria-hidden="true" size={16} />;
}

function CardPost({ post, indice }: { post: InstagramPost; indice: number }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      aria-label={`Abrir publicação ${indice + 1} no Instagram`}
      className="group relative aspect-[3/4] min-w-[82vw] snap-center overflow-hidden border border-white/10 bg-zinc-950 sm:min-w-0"
    >
      <img
        src={post.imageUrl}
        alt={post.alt ?? post.caption ?? "Publicação do Compete'Art Festival"}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/20 opacity-80 transition duration-500 group-hover:opacity-100" />

      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-white/20 bg-black/45 text-white backdrop-blur-md">
        <IconeTipoMidia tipo={post.mediaType} />
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/70">
          {formatarData(post.timestamp)}
        </span>
        <span className="flex translate-y-1 items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Ver post
          <ArrowUpRight aria-hidden="true" size={14} />
        </span>
      </div>
    </a>
  );
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState(INSTAGRAM_FALLBACK);

  useEffect(() => {
    const controller = new AbortController();

    buscarFeedInstagram(controller.signal)
      .then((feed) => {
        if (feed?.items.length) {
          setPosts(feed.items.slice(0, 4));
        }
      })
      .catch(() => {
        // As publicações locais permanecem visíveis se a API estiver indisponível.
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#080808] px-5 py-20 text-white sm:px-8 sm:py-24 md:px-10 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(249,115,22,0.09),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-10 grid gap-7 border-b border-white/15 pb-8 md:grid-cols-[1fr_auto] md:items-end md:gap-12 lg:mb-14 lg:pb-10">
          <div>
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-orange-400">
              @competeartfestival
            </p>
            <h2 className="max-w-4xl font-display text-[clamp(2rem,3.75vw,3.15rem)] leading-[0.98] tracking-[-0.04em]">
              Acompanhe no <span className="text-orange-400">Instagram.</span>
            </h2>
          </div>

          <a
            href={PERFIL_INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-fit items-center gap-3 border-b border-orange-400/70 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 transition hover:text-orange-300"
          >
            <Instagram aria-hidden="true" size={17} />
            Seguir perfil
            <ArrowUpRight
              aria-hidden="true"
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </a>
        </div>

        <div className="instagram-scroll -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {posts.map((post, indice) => (
            <CardPost key={post.id} post={post} indice={indice} />
          ))}
        </div>

        <p className="mt-7 max-w-xl text-xs leading-relaxed text-zinc-500 sm:mt-9">
          Bastidores, encontros e tudo o que acontece antes, durante e depois do palco.
        </p>
      </div>
    </section>
  );
}
