import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import HeaderSite from "../components/layout/HeaderSite";

const PALAVRAS_DINAMICAS = ["arte", "movimento", "palco", "competição"];

export default function Home() {
  const navegar = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [indicePalavra, setIndicePalavra] = useState(0);
  const [animarPalavra, setAnimarPalavra] = useState(false);
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

    setAnimarPalavra(true);
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
      <div className="pointer-events-none absolute top-24 left-1/2 z-20 h-px w-[88%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <div className="relative z-30 min-h-screen px-6 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto">
          <HeaderSite sobreFundo />
        </div>

        <div className="max-w-6xl mx-auto min-h-[calc(100vh-6.5rem)] grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-zinc-700 bg-zinc-950/80 px-4 py-2 text-xs tracking-[0.18em] uppercase text-gray-300">
              <span className="absolute inset-y-0 -left-10 w-16 bg-gradient-to-r from-transparent via-white/35 to-transparent varredura-luz" />
              <span className="h-1.5 w-1.5 rounded-full bg-orange-300" />
              <span>Inscrições abertas</span>
            </div>

            <div className="mt-8 flex justify-center lg:justify-start">
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
              Uma celebração de dança, performance e presença de palco. Cadastre sua escola
              ou sua inscrição independente e leve sua coreografia para o Compete'Art.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navegar("/inscricao")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-orange-500 text-black font-semibold hover:bg-orange-600 transition shadow-[0_10px_30px_rgba(249,115,22,0.25)]"
              >
                Quero me inscrever
                <ChevronRight size={18} />
              </button>
              <button
                onClick={() => navegar("/regulamento")}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-zinc-600 bg-zinc-950/50 text-gray-200 hover:border-orange-400/40 hover:text-white transition"
              >
                Ver regulamento
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/10 blur-2xl" />
            <div className="relative rounded-3xl border border-zinc-700 bg-zinc-950/70 backdrop-blur-md p-5 md:p-6 shadow-2xl">
              <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300 mb-3">
                  Destaque Compete'Art
                </p>
                <p className="text-white text-base md:text-lg leading-relaxed">
                  Um encontro de talento, presença de palco e emoção. O Compete'Art celebra
                  coreografias que contam histórias, marcam o público e transformam performance
                  em experiência.
                </p>
                <div className="mt-5 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
                <div className="mt-4 grid sm:grid-cols-3 gap-2 text-sm">
                  <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 px-3 py-2 text-gray-300">
                    Palco, luz e performance
                  </div>
                  <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 px-3 py-2 text-gray-300">
                    Escolas e talentos independentes
                  </div>
                  <div className="rounded-lg bg-zinc-900/80 border border-zinc-800 px-3 py-2 text-gray-300">
                    Dança, arte e competição
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
