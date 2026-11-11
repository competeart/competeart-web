import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import InstagramFeed from "../components/home/InstagramFeed";
import SiteFooter from "../components/home/SiteFooter";
import { PROXIMA_EDICAO } from "../data/evento";

const LINK_INSCRICOES =
  "https://coreohub.com/evento/competeart-festival-de-danca-internacional-2027";

function BotaoInscricao({ className = "" }: { className?: string }) {
  return (
    <a
      href={LINK_INSCRICOES}
      target="_blank"
      rel="noreferrer"
      className={`group min-h-14 items-stretch bg-orange-400 text-zinc-950 transition-colors duration-300 hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black ${className}`}
    >
      <span className="flex items-center px-4 text-[0.62rem] font-bold uppercase tracking-[0.14em] sm:px-7 sm:text-[0.7rem] sm:tracking-[0.18em]">
        Inscreva-se para 2027
      </span>
      <span className="flex items-center border-l border-black/20 px-4">
        <ArrowUpRight
          aria-hidden="true"
          size={18}
          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </a>
  );
}

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFalhou, setVideoFalhou] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {
      // Fallback visual permanece quando autoplay for bloqueado.
    });
  }, []);

  return (
    <>
      <main className="bg-[#080808]">
        <section className="relative min-h-[100svh] overflow-hidden">
          {!videoFalhou && (
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              muted
              preload="auto"
              onError={() => setVideoFalhou(true)}
              className="absolute inset-0 z-0 h-full w-full object-cover grayscale-[20%]"
            >
              <source src="/videos/bg-video.mp4" type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(5,5,5,0.93)_0%,rgba(5,5,5,0.66)_52%,rgba(5,5,5,0.9)_100%)] lg:bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.79)_46%,rgba(5,5,5,0.34)_100%)]" />
          <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
          <div className="absolute inset-0 z-10 bg-grade-editorial opacity-50" />
          <div className="absolute inset-x-0 bottom-0 z-20 h-[25svh] bg-gradient-to-b from-transparent via-[#080808]/75 to-[#080808] lg:h-[30svh]" />

          <div className="relative z-30 flex min-h-[100svh] flex-col px-5 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-7 md:px-10 lg:py-8">
            <div className="home-reveal home-reveal-1 mx-auto w-full max-w-7xl">
              <img
                src="/assets/logo.png"
                alt="Compete'Art"
                className="mx-auto w-16 sm:w-20 lg:mx-0 lg:w-24"
              />
            </div>

            <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 pb-5 pt-7 text-center sm:gap-10 sm:pb-8 sm:pt-9 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:gap-20 lg:py-10 lg:text-left">
              <div className="mx-auto max-w-3xl lg:mx-0">
                <p className="home-reveal home-reveal-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-orange-400 sm:text-[0.68rem]">
                  A segunda edição
                </p>

                <h1 className="home-reveal home-reveal-3 mx-auto mt-4 whitespace-nowrap font-display text-[clamp(1.95rem,9.2vw,2.65rem)] leading-none tracking-[-0.04em] text-white sm:text-[3.4rem] lg:mx-0 lg:mt-5 lg:text-[clamp(3.8rem,5vw,4.75rem)]">
                  Está <span className="text-orange-400">chegando.</span>
                </h1>

                <p className="home-reveal home-reveal-4 mx-auto mt-5 max-w-lg text-sm leading-relaxed text-zinc-300 sm:mt-6 sm:text-base lg:mx-0 lg:mt-7 lg:max-w-xl">
                  Em 2027, Campinas volta a receber movimento, presença e histórias que
                  só existem quando as luzes se acendem.
                </p>

                <BotaoInscricao className="home-reveal home-reveal-5 mt-8 hidden lg:inline-flex" />
              </div>

              <div className="home-reveal home-reveal-2 lg:justify-self-end">
                <div className="relative mx-auto w-full max-w-md border-b border-white/20 pb-6 sm:pb-8 lg:mx-0 lg:w-[27rem]">
                  <time
                    dateTime="2027-06-05"
                    aria-label={PROXIMA_EDICAO.dataCompleta}
                    className="mx-auto grid w-fit grid-cols-[auto_1fr] items-end gap-x-5 text-left sm:gap-x-7 lg:mx-0"
                  >
                    <span className="font-display text-[5.25rem] leading-[0.74] tracking-[-0.08em] text-white sm:text-[6.25rem] lg:text-[7.5rem]">
                      {PROXIMA_EDICAO.dia}
                    </span>
                    <div className="pb-0.5">
                      <span className="block text-3xl font-semibold leading-none tracking-[-0.04em] text-orange-400 sm:text-4xl lg:text-5xl">
                        {PROXIMA_EDICAO.mes}
                      </span>
                      <span className="mt-2.5 block text-[1.45rem] font-light leading-none tracking-[0.17em] text-white sm:text-[1.8rem] lg:mt-3 lg:text-[2.15rem]">
                        {PROXIMA_EDICAO.ano}
                      </span>
                    </div>
                  </time>

                  <div className="mt-6 flex items-start justify-center gap-3 border-t border-white/15 pt-5 text-left sm:mt-7 sm:pt-6 lg:mt-9 lg:justify-start">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-orange-400"
                      size={18}
                    />
                    <div>
                      <p className="text-xs font-semibold leading-snug text-white sm:text-sm lg:text-base">
                        {PROXIMA_EDICAO.local}
                      </p>
                      <p className="mt-1 text-[0.66rem] uppercase tracking-[0.2em] text-zinc-400 sm:text-xs">
                        {PROXIMA_EDICAO.cidade}
                      </p>
                    </div>
                  </div>

                  <a
                    href={PROXIMA_EDICAO.mapaExterno}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-5 inline-flex items-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-zinc-300 transition hover:text-orange-300 sm:text-xs lg:mt-7"
                  >
                    Ver localização
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>

                  <BotaoInscricao className="home-reveal home-reveal-5 mt-7 inline-flex lg:hidden" />
                </div>
              </div>
            </section>

            <a
              href="#instagram"
              aria-label="Ir para as novidades no Instagram"
              className="home-reveal home-reveal-5 group mx-auto mt-2 flex w-fit flex-col items-center gap-2 pb-1 text-[0.54rem] font-semibold uppercase tracking-[0.24em] text-zinc-500 transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white lg:mt-0"
            >
              <span>Role para continuar</span>
              <span aria-hidden="true" className="relative h-7 w-px overflow-hidden bg-white/15 lg:h-9">
                <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-orange-400" />
              </span>
            </a>
          </div>
        </section>

        <InstagramFeed />
      </main>
      <SiteFooter />
    </>
  );
}
