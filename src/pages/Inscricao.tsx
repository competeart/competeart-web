import { useNavigate } from "react-router-dom";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

const ETAPAS_CADASTRO = [
  {
    titulo: "1. Tipo de inscrição",
    descricao:
      "Escolha entre escola ou bailarino independente para abrir o fluxo correto.",
  },
  {
    titulo: "2. Elenco",
    descricao:
      "Cadastre todos os participantes que poderão ser vinculados às coreografias.",
  },
  {
    titulo: "3. Coreografias",
    descricao:
      "Informe dados técnicos e selecione o elenco participante em cada apresentação.",
  },
  {
    titulo: "4. Resumo e confirmação",
    descricao: "Revise valores e finalize sua confirmação pelo WhatsApp.",
  },
];

export default function Inscricao() {
  const navegar = useNavigate();

  return (
    <PaginaComVoltar
      titulo="Tipo de Inscrição"
      subtitulo="Antes de começar, entenda rapidamente como funciona o cadastro."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-5xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Resumo" },
      ]}
      etapaAtualId="tipo"
    >
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 md:p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-3">
          {ETAPAS_CADASTRO.map((etapa, indice) => (
            <div
              key={etapa.titulo}
              className="rounded-xl border border-zinc-800 bg-black/35 p-4"
            >
              <div className="text-xs uppercase tracking-wider text-orange-300 mb-2">
                Etapa {indice + 1}
              </div>
              <p className="font-medium text-white">{etapa.titulo}</p>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                {etapa.descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-secondary font-semibold text-white mb-3">
          Selecione o tipo de participante
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => navegar("/inscricao/escola")}
            className="group text-left px-6 py-5 rounded-xl border border-zinc-700 bg-zinc-950/70 text-white font-semibold hover:border-orange-400/60 hover:bg-zinc-900 transition"
          >
            <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-[11px] uppercase tracking-wider text-gray-300 group-hover:border-orange-400/50 group-hover:text-orange-200 transition">
              Principal
            </div>
            <div className="mt-1 text-lg">Escola</div>
            <p className="mt-2 text-sm text-gray-300 font-medium group-hover:text-gray-200 transition">
              Cadastro completo com equipe responsável, elenco e múltiplas
              coreografias.
            </p>
            <div className="mt-4 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full w-0 bg-orange-400 transition-all duration-300 group-hover:w-full" />
            </div>
          </button>

          <button
            onClick={() => navegar("/inscricao/independente")}
            className="group text-left px-6 py-5 rounded-xl border border-zinc-700 bg-zinc-950/70 text-white font-semibold hover:border-orange-400/60 hover:bg-zinc-900 transition"
          >
            <div className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-[11px] uppercase tracking-wider text-gray-300 group-hover:border-orange-400/50 group-hover:text-orange-200 transition">
              Individual
            </div>
            <div className="mt-1 text-lg">Bailarino Independente</div>
            <p className="mt-2 text-sm text-gray-300 font-medium group-hover:text-gray-200 transition">
              Fluxo simplificado para artistas sem vínculo com escola, mantendo
              elenco e coreografias.
            </p>
            <div className="mt-4 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full w-0 bg-orange-400 transition-all duration-300 group-hover:w-full" />
            </div>
          </button>
        </div>
      </section>
    </PaginaComVoltar>
  );
}
