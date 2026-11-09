import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Heart, Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_FALLBACK } from "../../data/instagramFallback";
import { buscarFeedInstagram, type InstagramPost } from "../../lib/instagram";

const PERFIL_INSTAGRAM = "https://www.instagram.com/competeartfestival/";
const VELOCIDADE_POR_SEGUNDO = 28;

const formatadorContagem = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatarContagem(valor = 0) {
  return formatadorContagem.format(valor);
}

interface PublicacaoProps {
  post: InstagramPost;
  indice: number;
  duplicada?: boolean;
}

function Publicacao({ post, indice, duplicada = false }: PublicacaoProps) {
  const curtidas = formatarContagem(post.likeCount);
  const comentarios = formatarContagem(post.commentsCount);

  return (
    <article className="relative aspect-[4/5] w-[72vw] shrink-0 overflow-hidden border-r border-white/10 bg-zinc-950 sm:w-[40vw] lg:w-[25vw]">
      <a
        href={post.permalink}
        target="_blank"
        rel="noreferrer"
        tabIndex={duplicada ? -1 : undefined}
        aria-label={`Abrir publicação ${indice + 1} no Instagram. ${curtidas} curtidas e ${comentarios} comentários.`}
        className="group absolute inset-0 block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-orange-400"
      >
        <img
          src={post.imageUrl}
          alt={post.alt ?? post.caption ?? "Publicação do Compete'Art Festival"}
          loading="lazy"
          decoding="async"
          draggable="false"
          className="h-full w-full select-none object-cover transition duration-700 ease-out group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
        />

        <div className="absolute inset-0 hidden items-center justify-center gap-7 bg-black/62 opacity-0 backdrop-blur-[1px] transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:flex">
          <span className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-white">
            <Heart aria-hidden="true" size={27} fill="currentColor" strokeWidth={1.7} />
            {curtidas}
          </span>
          <span className="flex items-center gap-2.5 text-[0.95rem] font-semibold text-white">
            <MessageCircle aria-hidden="true" size={27} fill="currentColor" strokeWidth={1.7} />
            {comentarios}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-5 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-4 pb-4 pt-10 text-xs font-semibold text-white md:hidden">
          <span className="flex items-center gap-2">
            <Heart aria-hidden="true" size={21} fill="currentColor" strokeWidth={1.7} />
            {curtidas}
          </span>
          <span className="flex items-center gap-2">
            <MessageCircle aria-hidden="true" size={21} fill="currentColor" strokeWidth={1.7} />
            {comentarios}
          </span>
        </div>
      </a>
    </article>
  );
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState(INSTAGRAM_FALLBACK);
  const [reduzirMovimento, setReduzirMovimento] = useState(false);
  const trilhoRef = useRef<HTMLDivElement>(null);
  const pausadoRef = useRef(false);
  const arrastandoRef = useRef(false);
  const inicioXRef = useRef(0);
  const inicioScrollRef = useRef(0);
  const moveuRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    buscarFeedInstagram(controller.signal)
      .then((feed) => {
        if (feed?.items.length) {
          setPosts(feed.items.slice(0, 10));
        }
      })
      .catch(() => {
        // As publicações locais permanecem visíveis se a API estiver indisponível.
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const preferencia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atualizarPreferencia = () => setReduzirMovimento(preferencia.matches);

    atualizarPreferencia();
    preferencia.addEventListener("change", atualizarPreferencia);
    return () => preferencia.removeEventListener("change", atualizarPreferencia);
  }, []);

  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho || reduzirMovimento) return;

    const posicionarNoGrupoCentral = window.requestAnimationFrame(() => {
      trilho.scrollLeft = trilho.scrollWidth / 3;
    });

    let quadro = 0;
    let ultimoTempo = performance.now();

    const animar = (tempo: number) => {
      const delta = Math.min(tempo - ultimoTempo, 50);
      ultimoTempo = tempo;

      if (!pausadoRef.current && !arrastandoRef.current) {
        trilho.scrollLeft += (VELOCIDADE_POR_SEGUNDO * delta) / 1000;
      }

      const larguraGrupo = trilho.scrollWidth / 3;
      if (larguraGrupo > 0) {
        if (trilho.scrollLeft >= larguraGrupo * 2) {
          trilho.scrollLeft -= larguraGrupo;
        } else if (trilho.scrollLeft <= 1) {
          trilho.scrollLeft += larguraGrupo;
        }
      }

      quadro = window.requestAnimationFrame(animar);
    };

    quadro = window.requestAnimationFrame(animar);
    return () => {
      window.cancelAnimationFrame(posicionarNoGrupoCentral);
      window.cancelAnimationFrame(quadro);
    };
  }, [posts, reduzirMovimento]);

  function iniciarArraste(evento: ReactPointerEvent<HTMLDivElement>) {
    pausadoRef.current = true;

    if (evento.pointerType !== "mouse" || evento.button !== 0) return;

    arrastandoRef.current = true;
    moveuRef.current = false;
    inicioXRef.current = evento.clientX;
    inicioScrollRef.current = evento.currentTarget.scrollLeft;
    evento.currentTarget.setPointerCapture(evento.pointerId);
  }

  function arrastar(evento: ReactPointerEvent<HTMLDivElement>) {
    if (!arrastandoRef.current) return;

    const deslocamento = evento.clientX - inicioXRef.current;
    if (Math.abs(deslocamento) > 4) moveuRef.current = true;
    evento.currentTarget.scrollLeft = inicioScrollRef.current - deslocamento;
  }

  function encerrarArraste(evento: ReactPointerEvent<HTMLDivElement>) {
    arrastandoRef.current = false;
    pausadoRef.current = evento.currentTarget.matches(":hover");

    if (evento.currentTarget.hasPointerCapture(evento.pointerId)) {
      evento.currentTarget.releasePointerCapture(evento.pointerId);
    }
  }

  const grupos = reduzirMovimento ? ["principal"] : ["anterior", "principal", "seguinte"];

  return (
    <section id="instagram" className="relative z-20 scroll-mt-0 overflow-hidden bg-[#080808] pb-20 pt-20 text-white sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-28">
      <div className="mx-auto mb-12 flex max-w-7xl flex-col items-center px-5 text-center sm:px-8 md:px-10 lg:mb-16">
        <a
          href={PERFIL_INSTAGRAM}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex flex-col items-center justify-center gap-4 text-white transition-colors hover:text-orange-300"
        >
          <Instagram aria-hidden="true" className="size-8 shrink-0 sm:size-9" strokeWidth={1.7} />
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] leading-none tracking-[-0.04em]">
            Siga no Instagram
          </h2>
        </a>
        <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-orange-400">
          @competeartfestival
        </p>
      </div>

      <div
        ref={trilhoRef}
        role="region"
        aria-label="Publicações recentes do Compete'Art no Instagram"
        className="instagram-scroll flex cursor-grab touch-pan-x overflow-x-auto overscroll-x-contain active:cursor-grabbing"
        onMouseEnter={() => {
          pausadoRef.current = true;
        }}
        onMouseLeave={() => {
          pausadoRef.current = false;
        }}
        onFocusCapture={() => {
          pausadoRef.current = true;
        }}
        onBlurCapture={(evento) => {
          if (!evento.currentTarget.contains(evento.relatedTarget)) {
            pausadoRef.current = false;
          }
        }}
        onPointerDown={iniciarArraste}
        onPointerMove={arrastar}
        onPointerUp={encerrarArraste}
        onPointerCancel={encerrarArraste}
        onClickCapture={(evento) => {
          if (moveuRef.current) {
            evento.preventDefault();
            moveuRef.current = false;
          }
        }}
      >
        {grupos.map((grupo) => {
          const duplicado = grupo !== "principal";

          return (
            <div
              key={grupo}
              className="flex shrink-0"
              aria-hidden={duplicado || undefined}
            >
              {posts.map((post, indice) => (
                <Publicacao
                  key={`${grupo}-${post.id}`}
                  post={post}
                  indice={indice}
                  duplicada={duplicado}
                />
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}
