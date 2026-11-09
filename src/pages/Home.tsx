import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import InstagramFeed from "../components/home/InstagramFeed";
import { PROXIMA_EDICAO } from "../data/evento";

const LINK_INSCRICOES =
  "https://coreohub.com/evento/competeart-festival-de-danca-internacional-2027";

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

        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.79)_46%,rgba(5,5,5,0.34)_100%)]" />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,transparent_35%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 z-10 bg-grade-editorial opacity-50" />
        <div className="absolute inset-x-0 bottom-0 z-20 h-[30svh] bg-gradient-to-b from-transparent via-[#080808]/75 to-[#080808]" />

        <div className="relative z-30 flex min-h-[100svh] flex-col px-5 py-5 sm:px-8 md:px-10 md:py-8">
        <div aria-hidden="true" className="mx-auto h-11 w-full max-w-7xl" />

        <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 py-12 text-center sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:gap-20 lg:py-4 lg:text-left">
          <div className="mx-auto max-w-3xl lg:mx-0">
            <div className="home-reveal home-reveal-1">
              <img
                src="/assets/logo.png"
                alt="Compete'Art"
                className="mx-auto w-24 sm:w-28 md:w-32 lg:mx-0"
              />
            </div>

            <h1 className="home-reveal home-reveal-3 mt-10 max-w-2xl font-display text-[clamp(2.55rem,5.2vw,4.85rem)] leading-[0.9] tracking-[-0.045em] text-white sm:mt-12">
              O palco chama
              <span className="block text-orange-400">outra vez.</span>
            </h1>

            <p className="home-reveal home-reveal-4 mx-auto mt-7 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base lg:mx-0">
              Movimento, presença e histórias que só existem quando as luzes se acendem.
              Em 2027, o palco volta a Campinas — e as inscrições já estão abertas.
            </p>

            <div className="home-reveal home-reveal-5 mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <a
                href={LINK_INSCRICOES}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-14 items-stretch bg-orange-400 text-zinc-950 transition-colors duration-300 hover:bg-orange-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
              >
                <span className="flex items-center px-6 text-[0.72rem] font-bold uppercase tracking-[0.2em] sm:px-7">
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

              <p className="text-[0.62rem] font-medium uppercase leading-relaxed tracking-[0.24em] text-zinc-400">
                Inscrições abertas
                <span className="block text-zinc-600">pela CoreoHub</span>
              </p>
            </div>
          </div>

          <div className="home-reveal home-reveal-2 lg:justify-self-end">
            <div className="relative mx-auto border-b border-white/25 pb-7 sm:pb-9 lg:mx-0 lg:w-[27rem]">
              <p className="mb-10 text-xs font-semibold uppercase tracking-[0.28em] text-orange-400 sm:mb-12">
                A próxima edição já tem data
              </p>

              <time
                dateTime="2027-06-05"
                aria-label={PROXIMA_EDICAO.dataCompleta}
                className="mx-auto grid w-fit grid-cols-[auto_1fr] items-end gap-x-6 text-left sm:gap-x-8 lg:mx-0"
              >
                <span className="font-display text-[6.5rem] leading-[0.74] tracking-[-0.08em] text-white sm:text-[7.5rem]">
                  {PROXIMA_EDICAO.dia}
                </span>
                <div className="pb-0.5">
                  <span className="block text-4xl font-semibold leading-none tracking-[-0.04em] text-orange-400 sm:text-5xl">
                    {PROXIMA_EDICAO.mes}
                  </span>
                  <span className="mt-3 block text-[1.7rem] font-light leading-none tracking-[0.19em] text-white sm:text-[2.15rem]">
                    {PROXIMA_EDICAO.ano}
                  </span>
                </div>
              </time>

              <div className="mt-9 flex items-start justify-center gap-3 border-t border-white/15 pt-6 text-left lg:justify-start">
                <MapPin aria-hidden="true" className="mt-0.5 shrink-0 text-orange-400" size={19} />
                <div>
                  <p className="text-sm font-semibold leading-snug text-white sm:text-base">
                    {PROXIMA_EDICAO.local}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-400">
                    {PROXIMA_EDICAO.cidade}
                  </p>
                </div>
              </div>

              <a
                href={PROXIMA_EDICAO.mapaExterno}
                target="_blank"
                rel="noreferrer"
                className="group mt-7 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200 transition hover:text-orange-300"
              >
                Ver localização
                <ArrowUpRight
                  aria-hidden="true"
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </section>
        </div>
      </section>

      <InstagramFeed />
    </main>
  );
}
