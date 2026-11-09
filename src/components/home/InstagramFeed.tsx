import { useEffect, useState } from "react";
import { ArrowUpRight, Images, Instagram, Play } from "lucide-react";
import { INSTAGRAM_FALLBACK } from "../../data/instagramFallback";
import { buscarFeedInstagram, type InstagramPost } from "../../lib/instagram";

const PERFIL_INSTAGRAM = "https://www.instagram.com/competeartfestival/";

const RITMO_GALERIA = [
  "sm:translate-y-10 lg:translate-y-16",
  "sm:translate-y-0",
  "sm:translate-y-16 lg:translate-y-24",
  "sm:translate-y-5 lg:translate-y-9",
];

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
    <div
      className={`min-w-[78vw] shrink-0 snap-center sm:min-w-0 ${RITMO_GALERIA[indice] ?? ""}`}
    >
      <span className="mb-3 block text-[0.6rem] font-semibold tracking-[0.28em] text-zinc-600">
        0{indice + 1}
      </span>

      <a
        href={post.permalink}
        target="_blank"
        rel="noreferrer"
        aria-label={`Abrir publicação ${indice + 1} no Instagram`}
        className="group relative block aspect-[4/5] overflow-hidden bg-zinc-950"
      >
        <img
          src={post.imageUrl}
          alt={post.alt ?? post.caption ?? "Publicação do Compete'Art Festival"}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-75 transition duration-500 group-hover:opacity-95" />

        <span className="absolute right-4 top-4 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
          <IconeTipoMidia tipo={post.mediaType} />
        </span>

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
          <span className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-white/75">
            <span aria-hidden="true" className="h-px w-5 bg-orange-400/80" />
            {formatarData(post.timestamp)}
          </span>
          <span className="flex translate-y-1 items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Ver post
            <ArrowUpRight aria-hidden="true" size={14} />
          </span>
        </div>
      </a>
    </div>
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
    <section className="relative z-20 overflow-hidden bg-[#080808] px-5 pb-20 pt-20 text-white sm:px-8 sm:pb-28 sm:pt-24 md:px-10 lg:pb-36 lg:pt-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 text-center md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.42fr)] md:items-end md:gap-16 md:text-left lg:mb-16">
          <div>
            <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-orange-400">
              @competeartfestival
            </p>
            <h2 className="max-w-2xl font-display text-[clamp(2.15rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.04em]">
              Acompanhe no
              <span className="block text-orange-400">Instagram.</span>
            </h2>
          </div>

          <div className="mx-auto max-w-sm md:mx-0 md:justify-self-end">
            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              Bastidores, encontros e tudo o que acontece antes, durante e depois do palco.
            </p>
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
        </div>

        <div className="instagram-scroll -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-20 lg:grid-cols-[0.94fr_1.06fr_0.96fr_1.04fr] lg:gap-4 lg:pb-24">
          {posts.map((post, indice) => (
            <CardPost key={post.id} post={post} indice={indice} />
          ))}
        </div>
      </div>
    </section>
  );
}
