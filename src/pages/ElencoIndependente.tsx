import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BailarinoForm from "../components/forms/BailarinoForm";
import { listarBailarinosIndependente } from "../lib/api";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";
import ToastAviso from "../components/ui/ToastAviso";
import ListaBailarinos from "../components/inscricao/ListaBailarinos";

export default function ElencoIndependente() {
  const { independenteId } = useParams();
  const navegar = useNavigate();

  const [bailarinos, setBailarinos] = useState<any[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [mensagemAviso, setMensagemAviso] = useState<string | null>(null);
  const [mostrarModalInfo, setMostrarModalInfo] = useState(true);
  const [avancando, setAvancando] = useState(false);

  useEffect(() => {
    if (!independenteId) return;

    listarBailarinosIndependente(independenteId)
      .then(setBailarinos)
      .finally(() => setCarregandoLista(false));
  }, [independenteId]);

  function avancarParaCoreografias() {
    if (avancando) return;

    if (bailarinos.length === 0) {
      setMensagemAviso(
        "Você precisa cadastrar ao menos um bailarino para avançar para coreografias.",
      );

      setTimeout(() => {
        setMensagemAviso(null);
      }, 8000);

      return;
    }

    setAvancando(true);
    navegar(`/independentes/${independenteId}/coreografias`);
  }

  if (!independenteId) return null;

  return (
    <PaginaComVoltar
      titulo="Cadastro do Elenco"
      subtitulo="Cadastre você e os demais participantes que poderão entrar nas coreografias."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "dados", titulo: "Dados" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Resumo" },
      ]}
      etapaAtualId="elenco"
    >
      {mostrarModalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMostrarModalInfo(false)}
          />

          <div className="relative w-full max-w-md rounded-xl bg-zinc-900 border border-zinc-800 p-6">
            <h2 className="text-xl font-primary text-orange-500 mb-3">
              Antes de continuar
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Nesta etapa, cadastre todos os bailarinos que vão participar das
              coreografias. Se a apresentação for solo, cadastre apenas você. Se
              houver mais participantes, cadastre cada um deles também.
            </p>

            <button
              onClick={() => setMostrarModalInfo(false)}
              className="mt-6 w-full px-4 py-3 rounded-lg bg-orange-500 text-black font-medium hover:bg-orange-600 transition"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

      {mensagemAviso && <ToastAviso mensagem={mensagemAviso} />}

      <div className="grid lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] gap-8 items-start">
        <BailarinoForm
          inscricaoId={independenteId}
          tipoInscricao="independente"
          aoCadastrarBailarino={(bailarino) =>
            setBailarinos((listaAtual) => [...listaAtual, bailarino])
          }
        />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 md:p-5">
          <div className="mb-3">
            <h2 className="font-secondary font-semibold text-white">Visão do elenco</h2>
            <p className="text-sm text-gray-400">
              Revise os participantes cadastrados antes de seguir.
            </p>
          </div>
          <ListaBailarinos bailarinos={bailarinos} carregando={carregandoLista} />

          <button
            onClick={avancarParaCoreografias}
            disabled={avancando}
            className="mt-8 px-6 py-3 w-full rounded-xl bg-orange-500 text-black font-medium hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {avancando ? "Avançando..." : "Avançar para Coreografias"}
          </button>
        </div>
      </div>
    </PaginaComVoltar>
  );
}
