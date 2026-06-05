import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import HeaderSite from "../components/layout/HeaderSite";
import { listarCronograma } from "../lib/api";
import type { ItemCronograma } from "../lib/api";

const PALAVRAS_DINAMICAS = ["arte", "movimento", "palco", "competição"];

export default function Home() {
  const navegar = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [indicePalavra, setIndicePalavra] = useState(0);
  const [animarPalavra, setAnimarPalavra] = useState(true);
  const [videoFalhou, setVideoFalhou] = useState(false);
  const [cronograma, setCronograma] = useState<ItemCronograma[]>([]);
  const [carregandoCronograma, setCarregandoCronograma] = useState(true);

  const palavraAtual = useMemo(
    () => PALAVRAS_DINAMICAS[indicePalavra],
    [indicePalavra],
  );

  const coreografiasPendentes = useMemo(
    () => cronograma.filter((item) => !item.concluidaCronograma),
    [cronograma],
  );
  const agoraNoPalco = coreografiasPendentes[0];
  const aSeguir = coreografiasPendentes[1];

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

  useEffect(() => {
    let ativo = true;

    listarCronograma()
      .then((dados) => {
        if (!ativo) return;
        setCronograma(dados || []);
      })
      .catch(() => {
        if (!ativo) return;
        setCronograma([]);
      })
      .finally(() => {
        if (ativo) setCarregandoCronograma(false);
      });

    return () => {
      ativo = false;
    };
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
              <div className="mb-4 space-y-3">
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-orange-400/25 bg-orange-500/10 px-4 py-2 text-sm text-orange-100 shadow-[0_10px_30px_rgba(249,115,22,0.08)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-orange-300/20 bg-orange-500/15 text-orange-300">
                    <CalendarDays size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-orange-200/75">
                      Data do festival
                    </p>
                    <p className="truncate font-medium text-white">05/06/2026</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navegar("/localizacao")}
                  className="group flex w-full items-start gap-3 rounded-2xl border border-zinc-800 bg-black/40 px-4 py-4 text-left transition hover:border-orange-400/35 hover:bg-black/55"
                >
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900/80 text-orange-300">
                    <MapPin size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                      Local
                    </p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-white">
                      Teatro Oficina do Estudante Iguatemi
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-400">
                      Shopping Iguatemi, Campinas/SP
                    </p>
                  </div>
                  <span className="pt-1 text-xs font-medium text-orange-300 transition group-hover:text-orange-200">
                    Ver mapa
                  </span>
                </button>

                <div className="relative overflow-hidden rounded-2xl border border-orange-400/25 bg-black/55 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.28)] md:p-5">
                  <span className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />
                  {carregandoCronograma ? (
                    <p className="text-sm text-zinc-400">Carregando cronograma...</p>
                  ) : agoraNoPalco ? (
                    <div className="space-y-4">
                      <div>
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                          <span className="text-orange-100">
                            {agoraNoPalco.ordemCronograma}
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_14px_rgba(248,113,113,0.9)]" />
                          Ao vivo
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight text-white md:text-3xl">
                          {agoraNoPalco.nome}
                        </h2>
                      </div>

                      {aSeguir && (
                        <div className="border-t border-zinc-800 pt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                            <span className="text-cyan-50">
                              {aSeguir.ordemCronograma}
                            </span>
                            <span className="mx-2 text-zinc-600">-</span>
                            A seguir
                          </p>
                          <h3 className="mt-2 text-lg font-semibold leading-snug text-white md:text-xl">
                            {aSeguir.nome}
                          </h3>
                        </div>
                      )}

                      <div className="border-t border-zinc-800 pt-4">
                        <button
                          type="button"
                          onClick={() => navegar("/cronograma")}
                          className="inline-flex items-center gap-2 text-sm font-medium text-orange-300 transition hover:text-orange-200"
                        >
                          Confira o cronograma completo
                          <ArrowRight size={15} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-400">
                      O cronograma ao vivo ainda não está disponível.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
