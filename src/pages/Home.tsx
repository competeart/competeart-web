import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Volume2,
  VolumeX,
  ChevronRight,
  Menu,
  X,
  Shield,
  Users,
  MapPin,
  FileText,
  Gavel,
  Lock,
} from "lucide-react";

const PALAVRAS_DINAMICAS = ["arte", "movimento", "palco", "competição"];
const ITENS_MENU_BLOQUEADOS = [
  { titulo: "Jurados", subtitulo: "Em breve", icone: Gavel },
  { titulo: "Equipe", subtitulo: "Em breve", icone: Users },
  { titulo: "Localização", subtitulo: "Em breve", icone: MapPin },
  { titulo: "Regulamento", subtitulo: "Em breve", icone: FileText },
];

export default function Home() {
  const navegar = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [muted, setMuted] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
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
    video
      .play()
      .catch(() => {
        // Em alguns navegadores o autoplay pode falhar; mantemos fallback visual.
      });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <button
        onClick={() => {
          if (!videoRef.current) return;

          const proximoMuted = !muted;
          videoRef.current.muted = proximoMuted;
          videoRef.current.volume = 0.4;
          setMuted(proximoMuted);

          if (!proximoMuted) {
            videoRef.current.play().catch(() => undefined);
          }
        }}
        className="absolute top-5 left-5 z-40 p-3 rounded-full border border-zinc-700 bg-black/70 text-white hover:bg-zinc-900 transition"
      >
        {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
      </button>

      <button
        onClick={() => setMenuAberto((aberto) => !aberto)}
        className="absolute top-5 right-5 z-40 p-3 rounded-full border border-zinc-700 bg-black/70 text-white hover:bg-zinc-900 transition"
        aria-label="Abrir menu"
      >
        {menuAberto ? <X size={18} /> : <Menu size={18} />}
      </button>

      {menuAberto && (
        <div className="absolute top-20 right-5 z-40 w-72 rounded-2xl border border-zinc-700 bg-zinc-950/95 backdrop-blur-md p-3 shadow-2xl">
          <button
            onClick={() => navegar("/admin/login")}
            className="w-full text-left rounded-xl border border-zinc-800 bg-black/40 hover:bg-zinc-900 transition px-4 py-3 flex items-center gap-3"
          >
            <span className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-300">
              <Shield size={16} />
            </span>
            <span>
              <span className="block text-sm font-medium text-white">Acesso administrativo</span>
              <span className="block text-xs text-gray-400">Painel de inscrições</span>
            </span>
          </button>

          <div className="my-3 h-px bg-zinc-800" />

          <div className="space-y-2">
            {ITENS_MENU_BLOQUEADOS.map((item) => {
              const Icone = item.icone;

              return (
                <div
                  key={item.titulo}
                  className="w-full rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 flex items-center gap-3 opacity-75"
                >
                  <span className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Icone size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-white">
                      {item.titulo}
                    </span>
                    <span className="block text-xs text-gray-400">
                      {item.subtitulo}
                    </span>
                  </span>
                  <span className="w-7 h-7 rounded-md border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-400">
                    <Lock size={13} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!videoFalhou && (
        <video
          ref={videoRef}
          autoPlay
          loop
          playsInline
          muted={muted}
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

      <div className="relative z-30 min-h-screen px-6 py-10 md:px-10">
        <div className="max-w-6xl mx-auto min-h-[calc(100vh-5rem)] grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
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
                onClick={() => navegar("/inscricao")}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-zinc-600 bg-zinc-950/50 text-gray-200 hover:border-orange-400/40 hover:text-white transition"
              >
                Ver regulamento
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/10 via-transparent to-pink-500/10 blur-2xl" />
            <div className="relative rounded-3xl border border-zinc-700 bg-zinc-950/70 backdrop-blur-md p-5 md:p-6 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400">data</p>
                  <p className=" mt-2 text-sm text-white">19 de maio de 2026</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400">local</p>
                  <p className="mt-2 text-sm text-white">Teatro Castro Mendes em Campinas/SP</p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-black/50 p-4 md:p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300 mb-3">
                  Destaque Compete'Art
                </p>
                <p className="text-white text-lg md:text-sm leading-relaxed">
                  Um encontro de talento, presença de palco e emoção. O Compete'Art celebra
                  coreografias que contam histórias, marcam o público e transformam performance
                  em experiência.
                </p>
                <div className="mt-5 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent" />
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
