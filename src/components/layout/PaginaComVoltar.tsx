import type { ReactNode } from "react";

interface EtapaFluxo {
  id: string;
  titulo: string;
}

interface PaginaComVoltarProps {
  titulo: string;
  subtitulo?: string;
  aoVoltar: () => void;
  children: ReactNode;
  classeContainer?: string;
  etapas?: EtapaFluxo[];
  etapaAtualId?: string;
}

function BarraEtapas({
  etapas,
  etapaAtualId,
}: {
  etapas: EtapaFluxo[];
  etapaAtualId?: string;
}) {
  const indiceAtual = etapas.findIndex((etapa) => etapa.id === etapaAtualId);

  return (
    <div className="mb-6 md:mb-8 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 md:p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {etapas.map((etapa, indice) => {
          const ativa = indice === indiceAtual;
          const concluida = indiceAtual >= 0 && indice < indiceAtual;

          return (
            <div
              key={etapa.id}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                ativa
                  ? "border-orange-400 bg-orange-500/10 text-orange-300"
                  : concluida
                    ? "border-cyan-500/30 bg-cyan-500/5 text-cyan-200"
                    : "border-zinc-800 bg-zinc-900/60 text-gray-400"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Etapa {indice + 1}
              </div>
              <div className="font-medium leading-tight">{etapa.titulo}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PaginaComVoltar({
  titulo,
  subtitulo,
  aoVoltar,
  children,
  classeContainer = "max-w-5xl",
  etapas,
  etapaAtualId,
}: PaginaComVoltarProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-8 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-grade-sutil opacity-60" />
      <div className="pointer-events-none absolute -top-28 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-orange-500/10 blur-3xl brilho-lento" />
      <div className="pointer-events-none absolute top-24 right-[-8rem] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl brilho-lento" />
      <div className="pointer-events-none absolute top-40 left-[-10rem] h-64 w-64 rounded-full bg-fuchsia-500/5 blur-3xl brilho-lento" />

      <div className={`relative ${classeContainer} mx-auto`}>
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={aoVoltar}
            className="text-sm text-gray-400 hover:text-white rounded-full border border-zinc-800 bg-zinc-950/70 px-4 py-2 transition"
          >
            ← Voltar
          </button>

          <div className="hidden md:block h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent linha-deslizante" />
        </div>

        {(etapas?.length ?? 0) > 0 && (
          <BarraEtapas etapas={etapas!} etapaAtualId={etapaAtualId} />
        )}

        <header className="mb-6 md:mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5 md:p-6 backdrop-blur-sm">
          <h1 className="font-primary text-2xl md:text-3xl text-orange-500 text-left">
            {titulo}
          </h1>
          {subtitulo && <p className="text-gray-300 mt-2 max-w-3xl">{subtitulo}</p>}
        </header>

        {children}
      </div>
    </main>
  );
}
