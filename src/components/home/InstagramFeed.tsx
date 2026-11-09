import { useEffect, useState } from "react";
import { ArrowUpRight, Instagram } from "lucide-react";
import { INSTAGRAM_FALLBACK } from "../../data/instagramFallback";
import { buscarFeedInstagram, type InstagramPost } from "../../lib/instagram";

const PERFIL_INSTAGRAM = "https://www.instagram.com/competeartfestival/";

function formatarData(timestamp: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

function resumirLegenda(post: InstagramPost) {
  const primeiraLinha = post.caption
    ?.split("\n")
    .map((trecho) => trecho.trim())
    .find(Boolean);
  const texto = primeiraLinha || post.alt;

  if (!texto || texto === "Publicação do Compete'Art Festival no Instagram") {
    return "Um novo registro do que acontece dentro e fora do palco.";
  }

  return texto.length > 190 ? `${texto.slice(0, 187).trimEnd()}…` : texto;
}

function Publicacao({ post, indice }: { post: InstagramPost; indice: number }) {
  return (
    <article className="grid min-w-[94%] snap-start grid-cols-1 gap-7 sm:min-w-[88%] md:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.68fr)] md:items-center md:gap-10 lg:min-w-[86%] lg:gap-16">
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
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 transition duration-500 group-hover:opacity-30" />
      </a>

      <div className="pb-3 text-left md:pb-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-orange-400">
          Publicado em
        </p>
        <time
          dateTime={post.timestamp}
          className="mt-3 block text-sm font-medium text-zinc-300"
        >
          {formatarData(post.timestamp)}
        </time>

        <p className="mt-7 max-w-md text-base leading-relaxed text-zinc-300 sm:text-lg md:mt-9">
          {resumirLegenda(post)}
        </p>

        <a
          href={post.permalink}
          target="_blank"
          rel="noreferrer"
          className="group mt-8 inline-flex items-center gap-3 border-b border-orange-400/70 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white transition hover:text-orange-300"
        >
          Ver publicação
          <ArrowUpRight
            aria-hidden="true"
            size={16}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </article>
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
              Últimos
              <span className="block text-orange-400">movimentos.</span>
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
              Acompanhar no Instagram
              <ArrowUpRight
                aria-hidden="true"
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>

        <div
          aria-label="Publicações recentes do Compete'Art no Instagram"
          className="instagram-scroll -mr-5 flex snap-x snap-mandatory gap-7 overflow-x-auto pb-3 pr-5 sm:-mr-8 sm:gap-10 sm:pr-8 md:-mr-10 md:gap-14 md:pr-10 lg:gap-20"
        >
          {posts.map((post, indice) => (
            <Publicacao key={post.id} post={post} indice={indice} />
          ))}
        </div>
      </div>
    </section>
  );
}
