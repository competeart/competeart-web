import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import HeaderSite from "../components/layout/HeaderSite";
import { PROXIMA_EDICAO } from "../data/evento";

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
    <main className="relative min-h-[100svh] overflow-hidden bg-[#080808]">
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

      <div className="relative z-30 flex min-h-[100svh] flex-col px-5 py-5 sm:px-8 md:px-10 md:py-8">
        <div className="mx-auto w-full max-w-7xl">
          <HeaderSite sobreFundo />
        </div>

        <section className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:gap-20 lg:py-4">
          <div className="max-w-3xl">
            <div className="home-reveal home-reveal-1">
              <img
                src="/assets/logo.png"
                alt="Compete'Art"
                className="w-36 sm:w-44 md:w-48"
              />
            </div>

            <h1 className="home-reveal home-reveal-3 mt-14 max-w-3xl font-display text-[clamp(3.35rem,8vw,7.25rem)] leading-[0.88] tracking-[-0.045em] text-white sm:mt-20">
              O palco chama
              <span className="block text-orange-400">outra vez.</span>
            </h1>

            <p className="home-reveal home-reveal-4 mt-7 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Movimento, presença e histórias que só existem quando as luzes se acendem.
              Campinas recebe um novo encontro em 2027.
            </p>
          </div>

          <div className="home-reveal home-reveal-2 lg:justify-self-end">
            <div className="relative border-b border-white/25 pb-7 sm:pb-9 lg:w-[27rem]">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.28em] text-orange-400">
                A próxima edição já tem data
              </p>

              <time
                dateTime="2027-06-05"
                aria-label={PROXIMA_EDICAO.dataCompleta}
                className="grid grid-cols-[auto_1fr] items-end gap-x-6 sm:gap-x-8"
              >
                <span className="font-display text-[7.2rem] leading-[0.72] tracking-[-0.08em] text-white sm:text-[8.25rem]">
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

              <div className="mt-9 flex items-start gap-3 border-t border-white/15 pt-6">
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

              <Link
                to="/localizacao"
                className="group mt-7 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-200 transition hover:text-orange-300"
              >
                Ver localização
                <ArrowUpRight
                  aria-hidden="true"
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          <p className="home-reveal home-reveal-5 text-[0.62rem] font-medium uppercase tracking-[0.3em] text-zinc-500 lg:col-span-2 lg:-mt-6">
            Em breve, novas informações
          </p>
        </section>
      </div>
    </main>
  );
}
