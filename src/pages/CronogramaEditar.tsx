import { useEffect, useMemo, useState } from "react";
import type { DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  GripVertical,
} from "lucide-react";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";
import {
  listarCronograma,
  marcarConclusaoCronograma,
  reordenarCronograma,
  validarAdmin,
} from "../lib/api";

type ItemCronograma = {
  id: string;
  nome: string;
  formacao: string;
  modalidade: string;
  categoria: string;
  escola: string;
  tipoInscricao: "ESCOLA" | "BAILARINO_INDEPENDENTE";
  quantidadeBailarinos: number;
  ordemCronograma: number;
  concluidaCronograma: boolean;
};

function formatarEnum(valor: string) {
  return valor
    .toLowerCase()
    .split("_")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

export default function CronogramaEditar() {
  const navegar = useNavigate();
  const [itens, setItens] = useState<ItemCronograma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [arrastandoId, setArrastandoId] = useState<string | null>(null);
  const [salvandoOrdem, setSalvandoOrdem] = useState(false);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);
  const [acessoValidado, setAcessoValidado] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) {
      navegar("/admin/login");
      return;
    }

    let ativo = true;

    validarAdmin(token).then((valido) => {
      if (!ativo) return;

      if (!valido) {
        localStorage.removeItem("admin-token");
        navegar("/admin/login");
        return;
      }

      setAcessoValidado(true);
    });

    return () => {
      ativo = false;
    };
  }, [navegar]);

  useEffect(() => {
    if (!acessoValidado) return;

    let ativo = true;

    listarCronograma()
      .then((dados) => {
        if (!ativo) return;
        setItens(dados || []);
        setErro("");
      })
      .catch((error) => {
        if (!ativo) return;
        setErro(error instanceof Error ? error.message : "Erro ao carregar cronograma.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [acessoValidado]);

  const concluidas = useMemo(
    () => itens.filter((item) => item.concluidaCronograma),
    [itens],
  );

  async function atualizarLista() {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarCronograma();
      setItens(dados || []);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar cronograma.");
    } finally {
      setCarregando(false);
    }
  }

  async function salvarOrdem(novaOrdem: ItemCronograma[]) {
    setItens(novaOrdem);
    setSalvandoOrdem(true);
    setErro("");

    try {
      const dados = await reordenarCronograma(novaOrdem.map((item) => item.id));
      setItens(dados || novaOrdem);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao reordenar cronograma.");
      await atualizarLista();
    } finally {
      setSalvandoOrdem(false);
    }
  }

  function aoSoltar(evento: DragEvent<HTMLLIElement>, destinoId: string) {
    evento.preventDefault();
    if (!arrastandoId || arrastandoId === destinoId) return;

    const origemIndex = itens.findIndex((item) => item.id === arrastandoId);
    const destinoIndex = itens.findIndex((item) => item.id === destinoId);
    if (origemIndex < 0 || destinoIndex < 0) return;

    const novaOrdem = [...itens];
    const [movido] = novaOrdem.splice(origemIndex, 1);
    novaOrdem.splice(destinoIndex, 0, movido);
    setArrastandoId(null);
    void salvarOrdem(novaOrdem);
  }

  async function alternarConclusao(item: ItemCronograma) {
    if (atualizandoId) return;
    setAtualizandoId(item.id);
    setErro("");

    try {
      const dados = await marcarConclusaoCronograma(
        item.id,
        !item.concluidaCronograma,
      );
      setItens(dados || []);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao atualizar cronograma.");
    } finally {
      setAtualizandoId(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-6 py-8 text-white md:py-10">
      <FundoFestival variante="admin" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <div className="mb-6">
          <div>
            <h1 className="text-2xl font-primary text-orange-400 md:text-3xl">
              Ordem das apresentações
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">
              Arraste as coreografias para reorganizar a sequência e marque uma
              apresentação como concluída para avançar o destaque público.
            </p>
          </div>
        </div>

        {erro && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {erro}
          </div>
        )}

        {carregando ? (
          <p className="text-sm text-zinc-400">Carregando cronograma...</p>
        ) : itens.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 px-4 py-8 text-center text-sm text-zinc-500">
            Nenhuma coreografia disponível no cronograma.
          </div>
        ) : (
          <>
            <section className="rounded-xl border border-zinc-800 bg-zinc-950/75">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-white">Ordem completa</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Arraste as coreografias para reorganizar a ordem.
                  </p>
                </div>
                {salvandoOrdem && (
                  <span className="text-xs text-orange-200">Salvando ordem...</span>
                )}
              </div>

              <ol className="divide-y divide-zinc-900/90">
                {itens.map((item, index) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={() => setArrastandoId(item.id)}
                    onDragOver={(evento) => evento.preventDefault()}
                    onDrop={(evento) => aoSoltar(evento, item.id)}
                    onDragEnd={() => setArrastandoId(null)}
                    className={`grid gap-3 px-4 py-3 transition md:grid-cols-[auto_1fr_auto] md:items-center ${
                      item.concluidaCronograma
                        ? "bg-emerald-500/10 text-emerald-50"
                        : arrastandoId === item.id
                          ? "bg-orange-500/10"
                          : "hover:bg-zinc-900/45"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="cursor-grab text-zinc-500">
                        <GripVertical size={17} />
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-xs text-zinc-300">
                        {index + 1}
                      </span>
                    </div>

                    <div>
                      <p className="font-medium text-white">{item.nome}</p>
                      <p className="mt-1 text-sm text-zinc-300">{item.escola}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatarEnum(item.formacao)} · {formatarEnum(item.modalidade)} ·{" "}
                        {item.quantidadeBailarinos} bailarinos
                      </p>
                    </div>

                    <div className="flex items-center gap-2 md:justify-end">
                      {item.concluidaCronograma && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/35 bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-100">
                          <CheckCircle2 size={13} />
                          Concluída
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => alternarConclusao(item)}
                        disabled={atualizandoId === item.id}
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition disabled:opacity-60 ${
                          item.concluidaCronograma
                            ? "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-orange-300/45"
                            : "border-emerald-300/40 bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25"
                        }`}
                      >
                        <Check size={14} />
                        {item.concluidaCronograma ? "Reabrir" : "Concluir"}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {concluidas.length > 0 && (
              <p className="mt-3 text-xs text-zinc-500">
                Coreografias concluídas ficam marcadas em verde e deixam de aparecer em
                “Agora” e “A seguir”.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
