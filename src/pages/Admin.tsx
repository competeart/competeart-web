import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, X } from "lucide-react";
import {
  buscarEscolaAdmin,
  listarBailarinos,
  listarBailarinosIndependente,
  listarEscolasAdmin,
} from "../lib/api";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";

type InscricaoAdmin = {
  id: string;
  nome: string;
  limiteCoreografias: number;
  bailarinosCadastrados: number;
  coreografiasCadastradas: number;
  valorTotal: number;
  tipoInscricao: "ESCOLA" | "BAILARINO_INDEPENDENTE";
  status: "FALTA_ELENCO" | "FALTA_COREOGRAFIA" | "COMPLETO";
};

type BailarinoResumo = {
  id: string;
  nomeCompleto: string;
  nomeArtistico?: string;
};

export default function Admin() {
  const navegar = useNavigate();

  const [inscricoes, setInscricoes] = useState<InscricaoAdmin[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  const [inscricaoSelecionada, setInscricaoSelecionada] = useState<InscricaoAdmin | null>(null);
  const [detalheInscricao, setDetalheInscricao] = useState<any>(null);
  const [elencoCompleto, setElencoCompleto] = useState<BailarinoResumo[]>([]);
  const [carregandoPainel, setCarregandoPainel] = useState(false);

  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valor);
  }

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) navegar("/admin/login");
  }, [navegar]);

  useEffect(() => {
    listarEscolasAdmin()
      .then((dados) => setInscricoes(dados || []))
      .finally(() => setCarregandoLista(false));
  }, []);

  function obterEtapasConcluidas(status: InscricaoAdmin["status"]) {
    if (status === "FALTA_ELENCO") return 1;
    if (status === "FALTA_COREOGRAFIA") return 2;
    return 3;
  }

  function obterTextoStatus(status: InscricaoAdmin["status"]) {
    return status === "COMPLETO" ? "Completo" : "Pendente";
  }

  function obterDetalheStatus(status: InscricaoAdmin["status"]) {
    if (status === "FALTA_ELENCO") return "Falta elenco";
    if (status === "FALTA_COREOGRAFIA") return "Falta coreografia";
    return "Fluxo finalizado";
  }

  function obterClasseStatus(status: InscricaoAdmin["status"]) {
    if (status === "COMPLETO") {
      return "border-emerald-300/40 bg-emerald-500/10 text-emerald-100";
    }

    return "border-rose-300/35 bg-rose-500/10 text-rose-100";
  }

  function gerarPathContinuacao(inscricao: InscricaoAdmin) {
    const prefixo =
      inscricao.tipoInscricao === "ESCOLA"
        ? `/inscricao/${inscricao.id}`
        : `/independentes/${inscricao.id}`;

    if (inscricao.status === "FALTA_ELENCO") return `${prefixo}/elenco`;
    if (inscricao.status === "FALTA_COREOGRAFIA") return `${prefixo}/coreografias`;
    return `${prefixo}/resumo`;
  }

  function gerarLinkRecuperacao(inscricao: InscricaoAdmin) {
    return `${window.location.origin}${gerarPathContinuacao(inscricao)}`;
  }

  async function copiarLinkContinuacao(inscricao: InscricaoAdmin, evento?: MouseEvent) {
    evento?.stopPropagation();

    const link = gerarLinkRecuperacao(inscricao);

    try {
      await navigator.clipboard.writeText(link);
    } catch {
      return;
    }

    setCopiadoId(inscricao.id);
    window.setTimeout(() => {
      setCopiadoId((atual) => (atual === inscricao.id ? null : atual));
    }, 1700);
  }

  async function abrirPainel(inscricao: InscricaoAdmin) {
    setInscricaoSelecionada(inscricao);
    setDetalheInscricao(null);
    setElencoCompleto([]);
    setCarregandoPainel(true);

    try {
      const [detalhe, elenco] = await Promise.all([
        buscarEscolaAdmin(inscricao.id),
        inscricao.tipoInscricao === "ESCOLA"
          ? listarBailarinos(inscricao.id)
          : listarBailarinosIndependente(inscricao.id),
      ]);

      setDetalheInscricao(detalhe);
      setElencoCompleto(elenco || []);
    } finally {
      setCarregandoPainel(false);
    }
  }

  function fecharPainel() {
    setInscricaoSelecionada(null);
    setDetalheInscricao(null);
    setElencoCompleto([]);
    setCarregandoPainel(false);
  }

  const tituloPainel = useMemo(() => {
    if (detalheInscricao?.escola?.nome) return detalheInscricao.escola.nome;
    if (detalheInscricao?.independente?.nomeResponsavel) return detalheInscricao.independente.nomeResponsavel;
    return inscricaoSelecionada?.nome ?? "Detalhes da inscrição";
  }, [detalheInscricao, inscricaoSelecionada]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-8 md:py-10">
      <FundoFestival variante="admin" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-primary text-orange-400">Painel de inscrições</h1>
          <p className="mt-2 text-sm text-zinc-300">
            Visualização técnica do andamento dos cadastros.
          </p>
        </div>

        {carregandoLista ? (
          <p className="text-sm text-zinc-400">Carregando inscrições...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/75">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-zinc-900/85">
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Progresso</th>
                  <th className="px-4 py-3 text-left font-medium">Valor</th>
                  <th className="px-4 py-3 text-right font-medium hidden md:table-cell">Link para continuar</th>
                </tr>
              </thead>

              <tbody>
                {inscricoes.map((inscricao) => {
                  const etapasConcluidas = obterEtapasConcluidas(inscricao.status);
                  const percentual = (etapasConcluidas / 3) * 100;

                  return (
                    <tr
                      key={inscricao.id}
                      onClick={() => abrirPainel(inscricao)}
                      className="border-b border-zinc-900/90 last:border-b-0 hover:bg-zinc-900/45 cursor-pointer"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-white font-medium">{inscricao.nome}</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {inscricao.tipoInscricao === "ESCOLA" ? "Escola" : "Bailarino independente"}
                        </p>
                        <button
                          onClick={(evento) => copiarLinkContinuacao(inscricao, evento)}
                          className={`mt-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition md:hidden ${
                            copiadoId === inscricao.id
                              ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                              : "border-zinc-700 bg-zinc-900 text-zinc-200"
                          }`}
                        >
                          {copiadoId === inscricao.id ? <Check size={13} /> : <Copy size={13} />}
                          {copiadoId === inscricao.id ? "Copiado!" : "Copiar link"}
                        </button>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${obterClasseStatus(
                            inscricao.status,
                          )}`}
                        >
                          {obterTextoStatus(inscricao.status)}
                        </span>
                        <p className="mt-1 text-xs text-zinc-400">{obterDetalheStatus(inscricao.status)}</p>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="w-44">
                          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-300 to-rose-300"
                              style={{ width: `${percentual}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-zinc-400">{etapasConcluidas}/3 etapas</p>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-orange-200 font-medium">
                        {formatarMoeda(inscricao.valorTotal)}
                      </td>

                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(evento) => copiarLinkContinuacao(inscricao, evento)}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition ${
                              copiadoId === inscricao.id
                                ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                                : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-orange-300/45"
                            }`}
                          >
                            {copiadoId === inscricao.id ? <Check size={13} /> : <Copy size={13} />}
                            {copiadoId === inscricao.id ? "Copiado!" : "Copiar link"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {inscricaoSelecionada && (
        <div className="fixed inset-0 z-50">
          <button
            onClick={fecharPainel}
            aria-label="Fechar painel"
            className="absolute inset-0 bg-black/55"
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-2xl border-l border-zinc-800 bg-zinc-950/98 backdrop-blur-sm shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/95 px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-orange-300">Detalhes rápidos</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">{tituloPainel}</h2>
                  <p className="mt-1 text-xs text-zinc-400">{inscricaoSelecionada.id}</p>
                </div>

                <button
                  onClick={fecharPainel}
                  className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
                >
                  <X size={15} className="mx-auto" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5 text-sm">
              {carregandoPainel ? (
                <p className="text-zinc-400">Carregando informações...</p>
              ) : (
                <>
                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">Resumo</h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                        <p className="text-xs text-zinc-500">Elenco</p>
                        <p className="mt-1 text-zinc-100 font-medium">{elencoCompleto.length}</p>
                      </div>
                      <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                        <p className="text-xs text-zinc-500">Coreografias</p>
                        <p className="mt-1 text-zinc-100 font-medium">
                          {detalheInscricao?.detalhamento?.coreografias?.length ?? 0}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">Elenco</h3>
                    {elencoCompleto.length === 0 ? (
                      <p className="mt-3 text-zinc-500">Nenhum bailarino cadastrado.</p>
                    ) : (
                      <div className="mt-3 grid sm:grid-cols-2 gap-2">
                        {elencoCompleto.map((bailarino) => (
                          <div key={bailarino.id} className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                            <p className="text-zinc-100 font-medium">
                              {bailarino.nomeArtistico || bailarino.nomeCompleto}
                            </p>
                            {bailarino.nomeArtistico && (
                              <p className="text-xs text-zinc-500">{bailarino.nomeCompleto}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">Coreografias</h3>
                    {(detalheInscricao?.detalhamento?.coreografias?.length ?? 0) === 0 ? (
                      <p className="mt-3 text-zinc-500">Nenhuma coreografia cadastrada.</p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {detalheInscricao.detalhamento.coreografias.map((coreografia: any) => (
                          <div key={coreografia.id} className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-3">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-zinc-100 font-medium">{coreografia.nome}</p>
                                <p className="mt-1 text-xs text-zinc-500">
                                  {coreografia.formacao} • {coreografia.modalidade} • {coreografia.bailarinos} bailarinos
                                </p>
                              </div>
                            <p className="text-xs text-orange-200 font-medium">
                              {formatarMoeda(coreografia.valor)}
                            </p>
                          </div>
                        </div>
                      ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
