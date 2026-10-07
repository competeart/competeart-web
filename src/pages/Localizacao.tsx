import { useEffect, useState } from "react";
import { Check, Copy, ExternalLink, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";
import { PROXIMA_EDICAO } from "../data/evento";

export default function Localizacao() {
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!copiado) return;

    const timer = window.setTimeout(() => setCopiado(false), 1800);
    return () => window.clearTimeout(timer);
  }, [copiado]);

  async function copiarEndereco() {
    try {
      await navigator.clipboard.writeText(PROXIMA_EDICAO.endereco);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative min-h-screen overflow-hidden px-6 py-6 md:px-10 md:py-8 text-white"
    >
      <FundoFestival />

      <div className="relative z-20 mx-auto max-w-6xl">
        <HeaderSite />

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 md:p-7 shadow-md backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-orange-200">
              <MapPin size={13} />
              Local do evento
            </div>

            <h1 className="mt-4 font-primary text-3xl md:text-4xl">Localização</h1>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
              {PROXIMA_EDICAO.dataCompleta}
            </p>
            <h2 className="mt-3 text-xl md:text-2xl font-semibold text-orange-300">
              {PROXIMA_EDICAO.local}
            </h2>

            <p className="mt-3 text-gray-300 leading-relaxed">{PROXIMA_EDICAO.endereco}</p>

            <button
              type="button"
              onClick={copiarEndereco}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                copiado
                  ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                  : "border-zinc-700 bg-zinc-900/60 text-gray-200 hover:border-orange-400/40 hover:text-white"
              }`}
            >
              {copiado ? <Check size={16} /> : <Copy size={16} />}
              {copiado ? "Copiado!" : "Copiar endereço"}
            </button>
          </article>

          <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 md:p-4 shadow-md backdrop-blur-sm">
            <div className="overflow-hidden rounded-xl border border-zinc-800 bg-black/30 shadow-sm">
              <iframe
                src={PROXIMA_EDICAO.mapaEmbed}
                title="Mapa do Teatro Oficina do Estudante Iguatemi"
                className="h-[420px] w-full md:h-[450px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <a
              href={PROXIMA_EDICAO.mapaExterno}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-orange-500/35 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:bg-orange-500/20 hover:text-orange-100 md:w-auto"
            >
              <ExternalLink size={16} />
              Abrir no Google Maps
            </a>
          </article>
        </section>
      </div>
    </motion.main>
  );
}
