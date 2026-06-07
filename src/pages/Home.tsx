import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import HeaderSite from "../components/layout/HeaderSite";
import { RESULTADOS_FESTIVAL_URL } from "../lib/resultadosFestival";

const PALAVRAS_DINAMICAS = ["arte", "movimento", "palco", "competição"];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [indicePalavra, setIndicePalavra] = useState(0);
  const [animarPalavra, setAnimarPalavra] = useState(true);
  const [videoFalhou, setVideoFalhou] = useState(false);

  const palavraAtual = useMemo(
    () => PALAVRAS_DINAMICAS[indicePalavra],
    [indicePalavra],
  );

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAnimarPalavra(false);
      window.setTimeout(() => {
        setIndicePalavra((atual) => (atual + 1) % PALAVRAS_DINAMICAS.length);
        setAnimarPalavra(true);
      }, 50);
    }, 1900);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {
      // Fallback visual permanece quando autoplay for bloqueado.
    });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      {!videoFalhou && (
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted
          preload="auto"
          poster="/assets/adminbg.jpg"
          onError={() => setVideoFalhou(true)}
          className="absolute inset-0 z-0 h-full w-full object-cover"
        >
          <source src="/videos/bg-video.mp4" type="video/mp4" />
        </video>
      )}

      <div className="absolute inset-0 z-10 bg-black/70" />
      <div className="absolute inset-0 z-10 bg-grade-sutil opacity-30" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(249,115,22,0.18),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(244,114,182,0.14),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(34,211,238,0.10),transparent_45%)]" />
     
      <div className="relative z-30 min-h-screen px-6 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto">
          <HeaderSite sobreFundo />
        </div>

        <div className="max-w-6xl mx-auto min-h-[calc(100vh-6.5rem)] grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <img
                src="/assets/logo.png"
                alt="Compete'Art"
                className="w-44 md:w-52 lg:w-64 drop-shadow-[0_0_28px_rgba(249,115,22,0.24)]"
              />
            </div>

            <h1 className="mt-6 text-3xl md:text-5xl lg:text-6xl font-primary leading-tight text-white">
              Um festival de
              <span
                key={palavraAtual}
                className={`block text-orange-400 ${animarPalavra ? "texto-pulsante" : ""}`}
              >
                {palavraAtual}
              </span>
            </h1>

            <p className="mt-5 text-base md:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Uma celebração de dança, performance e presença de palco. As inscrições para
              esta edição foram encerradas.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-zinc-700 bg-zinc-950/80 px-4 py-2 text-xs tracking-[0.18em] uppercase text-gray-300">
                <span className="absolute inset-y-0 -left-10 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent varredura-luz" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <span>Inscrições encerradas</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/10 blur-2xl" />
            <div className="relative rounded-3xl border border-zinc-700 bg-zinc-950/70 backdrop-blur-md p-5 md:p-6 shadow-2xl">
              <div className="relative overflow-hidden rounded-2xl border border-orange-400/25 bg-black/55 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-6">
                <span className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-300">
                    Festival encerrado
                  </p>
                  <div>
                    <h2 className="text-3xl font-primary leading-tight text-white md:text-4xl">
                      Obrigado por viver esse palco com a gente.
                    </h2>
                    <p className="mt-4 text-base leading-relaxed text-zinc-300">
                      A edição 2026 chegou ao fim. Nos vemos em breve para novos
                      encontros, novas apresentações e mais dança.
                    </p>
                  </div>
                  <a
                    href={RESULTADOS_FESTIVAL_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-orange-400 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_18px_40px_rgba(249,115,22,0.22)] transition hover:bg-orange-300"
                  >
                    Ver resultado do festival
                    <ExternalLink size={15} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
