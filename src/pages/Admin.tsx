import { useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Trash2,
  TicketCheck,
  X,
} from "lucide-react";
import {
  buscarEscolaAdmin,
  excluirInscricaoAdmin,
  listarBailarinos,
  listarBailarinosIndependente,
  listarEscolasAdmin,
} from "../lib/api";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";
import { gerarResumoPdf } from "../lib/resumoPdf";

type InscricaoAdmin = {
  id: string;
  nome: string;
  dataInscricao: string;
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
  nomeArtistico: string;
  tipoDocumento: "CPF" | "RG";
  documento: string;
  dataNascimento: string;
  escolaId?: string | null;
  independenteId?: string | null;
  criadoEm: string;
};

export default function Admin() {
  const navegar = useNavigate();

  const [inscricoes, setInscricoes] = useState<InscricaoAdmin[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  const [inscricaoSelecionada, setInscricaoSelecionada] =
    useState<InscricaoAdmin | null>(null);
  const [detalheInscricao, setDetalheInscricao] = useState<any>(null);
  const [elencoCompleto, setElencoCompleto] = useState<BailarinoResumo[]>([]);
  const [carregandoPainel, setCarregandoPainel] = useState(false);
  const [baixandoPdfDetalhe, setBaixandoPdfDetalhe] = useState(false);
  const [inscricaoParaExcluir, setInscricaoParaExcluir] =
    useState<InscricaoAdmin | null>(null);
  const [excluindoId, setExcluindoId] = useState<string | null>(null);
  const [erroExclusao, setErroExclusao] = useState<string | null>(null);

  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    "TODOS" | "FALTA_ELENCO" | "FALTA_COREOGRAFIA" | "COMPLETO"
  >("TODOS");
  const [ordenacao, setOrdenacao] = useState<
    "NOME_AZ" | "NOME_ZA" | "DATA_ANTIGA" | "DATA_RECENTE"
  >("DATA_RECENTE");

  function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valor);
  }

  function formatarData(dataIso: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dataIso));
  }

  function formatarDataSomente(dataIso: string) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(dataIso));
  }

  function formatarDocumento(tipoDocumento: "CPF" | "RG", documento: string) {
    if (tipoDocumento === "RG") {
      const caracteres = documento.toUpperCase().replace(/[^0-9X]/g, "").slice(0, 9);
      if (caracteres.length <= 2) return caracteres;
      if (caracteres.length <= 5) return `${caracteres.slice(0, 2)}.${caracteres.slice(2)}`;
      if (caracteres.length <= 8) {
        return `${caracteres.slice(0, 2)}.${caracteres.slice(2, 5)}.${caracteres.slice(5)}`;
      }

      return `${caracteres.slice(0, 2)}.${caracteres.slice(2, 5)}.${caracteres.slice(5, 8)}-${caracteres.slice(8)}`;
    }

    const numeros = documento.replace(/\D/g, "").slice(0, 11);
    if (numeros.length !== 11) return documento;

    return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
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

  function obterStatusEfetivo(inscricao: InscricaoAdmin): InscricaoAdmin["status"] {
    if (inscricao.bailarinosCadastrados === 0) return "FALTA_ELENCO";
    if (inscricao.coreografiasCadastradas < inscricao.limiteCoreografias) {
      return "FALTA_COREOGRAFIA";
    }
    return "COMPLETO";
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
    if (inscricao.status === "FALTA_COREOGRAFIA")
      return `${prefixo}/coreografias`;
    return `${prefixo}/resumo`;
  }

  function gerarLinkRecuperacao(inscricao: InscricaoAdmin) {
    return `${window.location.origin}${gerarPathContinuacao(inscricao)}`;
  }

  async function copiarLinkContinuacao(
    inscricao: InscricaoAdmin,
    evento?: MouseEvent,
  ) {
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

  function baixarPdfDetalhe() {
    if (!detalheInscricao || baixandoPdfDetalhe) return;
    setBaixandoPdfDetalhe(true);

    try {
      const ehEscola = Boolean(detalheInscricao.escola);
      const cadastro = ehEscola ? detalheInscricao.escola : detalheInscricao.independente;
      const tituloCadastro = ehEscola
        ? detalheInscricao.escola.nome
        : detalheInscricao.independente.nomeResponsavel;

      gerarResumoPdf({
        nomeArquivo: `resumo-admin-${tituloCadastro}.pdf`,
        titulo: "Resumo da Inscrição",
        subtitulo: tituloCadastro,
        blocos: [
          {
            titulo: ehEscola ? "Dados da escola" : "Dados da inscrição independente",
            campos: ehEscola
              ? [
                  { rotulo: "Nome", valor: cadastro.nome },
                  { rotulo: "E-mail", valor: cadastro.email },
                  { rotulo: "WhatsApp", valor: cadastro.whatsapp },
                  { rotulo: "Direção", valor: cadastro.nomeDiretor },
                  { rotulo: "Endereço", valor: cadastro.endereco },
                  {
                    rotulo: "Limite de coreografias",
                    valor: cadastro.limiteCoreografias,
                  },
                ]
              : [
                  { rotulo: "Responsável", valor: cadastro.nomeResponsavel },
                  { rotulo: "E-mail", valor: cadastro.email },
                  { rotulo: "WhatsApp", valor: cadastro.whatsapp },
                  {
                    rotulo: "Limite de coreografias",
                    valor: cadastro.limiteCoreografias,
                  },
                ],
            listas: ehEscola
              ? [
                  {
                    titulo: "Profissionais cadastrados",
                    itens:
                      cadastro.profissionais?.map((profissional: any) => {
                        const funcao =
                          profissional.funcao === "COREOGRAFO"
                            ? "Coreógrafo(a)"
                            : "Assistente";
                        return `${profissional.nome} • ${funcao}${
                          profissional.ehExtra ? " • Extra" : ""
                        }`;
                      }) ?? [],
                  },
                ]
              : undefined,
          },
          {
            titulo: "Elenco",
            listas: [
              {
                titulo: "Bailarinos cadastrados",
                itens: elencoCompleto.map((bailarino) => {
                  return `${bailarino.nomeArtistico} • ${bailarino.nomeCompleto} • ${
                    bailarino.tipoDocumento
                  } ${formatarDocumento(
                    bailarino.tipoDocumento,
                    bailarino.documento,
                  )} • ${formatarDataSomente(bailarino.dataNascimento)}`;
                }),
              },
            ],
          },
          {
            titulo: "Coreografias",
            listas: [
              {
                titulo: "Coreografias cadastradas",
                itens:
                  detalheInscricao.detalhamento.coreografias?.map((coreografia: any) => {
                    return `${coreografia.nome} • ${coreografia.formacao} • ${coreografia.modalidade} • ${coreografia.categoria} • ${coreografia.duracao} • ${coreografia.bailarinos} bailarinos • ${formatarMoeda(coreografia.valor)}`;
                  }) ?? [],
              },
            ],
          },
        ],
        totais: {
          coreografias: valorCoreografiasDetalhe,
          profissionaisExtras: valorProfissionaisExtrasDetalhe,
          total: valorTotalDetalhe,
        },
      });
    } finally {
      setBaixandoPdfDetalhe(false);
    }
  }

  function abrirModalExclusao(inscricao: InscricaoAdmin, evento?: MouseEvent) {
    evento?.stopPropagation();
    setErroExclusao(null);
    setInscricaoParaExcluir(inscricao);
  }

  function fecharModalExclusao() {
    if (excluindoId) return;
    setInscricaoParaExcluir(null);
  }

  async function confirmarExclusao() {
    if (!inscricaoParaExcluir || excluindoId) return;

    const id = inscricaoParaExcluir.id;
    setExcluindoId(id);
    setErroExclusao(null);

    try {
      await excluirInscricaoAdmin(id);

      setInscricoes((atuais) => atuais.filter((item) => item.id !== id));

      if (inscricaoSelecionada?.id === id) {
        fecharPainel();
      }

      setInscricaoParaExcluir(null);
    } catch (error: any) {
      setErroExclusao(error?.message || "Não foi possível excluir a inscrição.");
    } finally {
      setExcluindoId(null);
    }
  }

  const tituloPainel = useMemo(() => {
    if (detalheInscricao?.escola?.nome) return detalheInscricao.escola.nome;
    if (detalheInscricao?.independente?.nomeResponsavel)
      return detalheInscricao.independente.nomeResponsavel;
    return inscricaoSelecionada?.nome ?? "Detalhes da inscrição";
  }, [detalheInscricao, inscricaoSelecionada]);

  const valorCoreografiasDetalhe = detalheInscricao?.valores?.coreografias ?? 0;
  const valorProfissionaisExtrasDetalhe =
    detalheInscricao?.valores?.profissionaisExtras ??
    detalheInscricao?.valores?.assistentesExtras ??
    0;
  const qtdProfissionaisExtrasDetalhe =
    detalheInscricao?.totais?.profissionaisExtras ??
    detalheInscricao?.totais?.assistentesExtras ??
    0;
  const valorTotalDetalhe = detalheInscricao?.valores?.total ?? 0;
  const inscricoesFiltradasOrdenadas = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();

    const filtradas = inscricoes.filter((inscricao) => {
      const statusEfetivo = obterStatusEfetivo(inscricao);
      const bateBusca =
        termo.length === 0 || inscricao.nome.toLowerCase().includes(termo);
      const bateStatus =
        filtroStatus === "TODOS" || statusEfetivo === filtroStatus;

      return bateBusca && bateStatus;
    });

    return filtradas.sort((a, b) => {
      if (ordenacao === "NOME_AZ") {
        return a.nome.localeCompare(b.nome, "pt-BR");
      }

      if (ordenacao === "NOME_ZA") {
        return b.nome.localeCompare(a.nome, "pt-BR");
      }

      const dataA = new Date(a.dataInscricao).getTime();
      const dataB = new Date(b.dataInscricao).getTime();

      if (ordenacao === "DATA_ANTIGA") return dataA - dataB;
      return dataB - dataA;
    });
  }, [inscricoes, termoBusca, filtroStatus, ordenacao]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-8 md:py-10">
      <FundoFestival variante="admin" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-primary text-orange-400">
              Painel de inscrições
            </h1>
            <p className="mt-2 text-sm text-zinc-300">
              Visualização técnica do andamento dos cadastros.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navegar("/check-in")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-200 transition hover:border-orange-300/45"
          >
            <TicketCheck size={15} />
            Check-in
          </button>
        </div>

        <div className="mb-4 grid gap-2 md:grid-cols-3">
          <input
            value={termoBusca}
            onChange={(evento) => setTermoBusca(evento.target.value)}
            placeholder="Pesquisar por nome da escola ou responsável"
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-300/45"
          />

          <select
            value={filtroStatus}
            onChange={(evento) =>
              setFiltroStatus(
                evento.target.value as
                  | "TODOS"
                  | "FALTA_ELENCO"
                  | "FALTA_COREOGRAFIA"
                  | "COMPLETO",
              )
            }
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:border-orange-300/45"
          >
            <option value="TODOS">Filtrar status: Todos</option>
            <option value="FALTA_ELENCO">Filtrar status: Falta elenco</option>
            <option value="FALTA_COREOGRAFIA">Filtrar status: Falta coreografia</option>
            <option value="COMPLETO">Filtrar status: Completo</option>
          </select>

          <select
            value={ordenacao}
            onChange={(evento) =>
              setOrdenacao(
                evento.target.value as
                  | "NOME_AZ"
                  | "NOME_ZA"
                  | "DATA_ANTIGA"
                  | "DATA_RECENTE",
              )
            }
            className="h-10 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:border-orange-300/45"
          >
            <option value="NOME_AZ">Ordenar por: Nome (A-Z)</option>
            <option value="NOME_ZA">Ordenar por: Nome (Z-A)</option>
            <option value="DATA_ANTIGA">Ordenar por: Data (mais antiga)</option>
            <option value="DATA_RECENTE">Ordenar por: Data (mais recente)</option>
          </select>
        </div>

        <p className="mb-3 text-sm text-zinc-400">
          Quantidade de inscrições:{" "}
          <span className="text-zinc-100 font-medium">
            {inscricoesFiltradasOrdenadas.length}
          </span>
        </p>

        {carregandoLista ? (
          <p className="text-sm text-zinc-400">Carregando inscrições...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/75">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-zinc-900/85">
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-4 py-3 text-left font-medium">Nome</th>
                  <th className="px-4 py-3 text-left font-medium">Data inscrição</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Progresso</th>
                  <th className="px-4 py-3 text-left font-medium">Valor</th>
                  <th className="px-4 py-3 text-right font-medium hidden md:table-cell">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {inscricoesFiltradasOrdenadas.map((inscricao) => {
                  const statusEfetivo = obterStatusEfetivo(inscricao);
                  const etapasConcluidas = obterEtapasConcluidas(statusEfetivo);
                  const percentual = (etapasConcluidas / 3) * 100;

                  return (
                    <tr
                      key={inscricao.id}
                      onClick={() => abrirPainel(inscricao)}
                      className="border-b border-zinc-900/90 last:border-b-0 hover:bg-zinc-900/45 cursor-pointer"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-white font-medium">
                          {inscricao.nome}
                        </p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {inscricao.tipoInscricao === "ESCOLA"
                            ? "Escola"
                            : "Bailarino independente"}
                        </p>
                        <button
                          onClick={(evento) =>
                            copiarLinkContinuacao(inscricao, evento)
                          }
                          className={`mt-2 inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs transition md:hidden ${
                            copiadoId === inscricao.id
                              ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                              : "border-zinc-700 bg-zinc-900 text-zinc-200"
                          }`}
                        >
                          {copiadoId === inscricao.id ? (
                            <Check size={13} />
                          ) : (
                            <Copy size={13} />
                          )}
                          {copiadoId === inscricao.id
                            ? "Copiado!"
                            : "Copiar link"}
                        </button>
                        <button
                          onClick={(evento) =>
                            abrirModalExclusao(inscricao, evento)
                          }
                          className="mt-2 ml-2 inline-flex items-center gap-1.5 rounded-md border border-red-300/35 bg-red-500/10 px-2.5 py-1.5 text-xs text-red-100 transition hover:bg-red-500/20 md:hidden"
                        >
                          <Trash2 size={13} />
                          Excluir
                        </button>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-zinc-300">
                        {formatarData(inscricao.dataInscricao)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${obterClasseStatus(
                            statusEfetivo,
                          )}`}
                        >
                          {obterTextoStatus(statusEfetivo)}
                        </span>
                        <p className="mt-1 text-xs text-zinc-400">
                          {obterDetalheStatus(statusEfetivo)}
                        </p>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="w-44">
                          <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-orange-300 to-rose-300"
                              style={{ width: `${percentual}%` }}
                            />
                          </div>
                          <p className="mt-1 text-xs text-zinc-400">
                            {etapasConcluidas}/3 etapas
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-orange-200 font-medium">
                        {formatarMoeda(inscricao.valorTotal)}
                      </td>

                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(evento) =>
                              copiarLinkContinuacao(inscricao, evento)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition ${
                              copiadoId === inscricao.id
                                ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-100"
                                : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-orange-300/45"
                            }`}
                          >
                            {copiadoId === inscricao.id ? (
                              <Check size={13} />
                            ) : (
                              <Copy size={13} />
                            )}
                            {copiadoId === inscricao.id
                              ? "Copiado!"
                              : "Copiar link"}
                          </button>
                          <button
                            onClick={(evento) =>
                              abrirModalExclusao(inscricao, evento)
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-red-300/35 bg-red-500/10 px-3 py-1.5 text-xs text-red-100 transition hover:bg-red-500/20"
                          >
                            <Trash2 size={13} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {inscricoesFiltradasOrdenadas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-zinc-500">
                      Nenhuma inscrição encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}
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
                  <p className="text-xs uppercase tracking-[0.14em] text-orange-300">
                    Detalhes rápidos
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {tituloPainel}
                  </h2>
                  <p className="mt-1 text-xs text-zinc-400">
                    {inscricaoSelecionada.id}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={baixarPdfDetalhe}
                    disabled={carregandoPainel || baixandoPdfDetalhe}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 hover:border-orange-300/45 disabled:opacity-60"
                  >
                    <Download size={14} />
                    {baixandoPdfDetalhe ? "Gerando..." : "Baixar PDF"}
                  </button>
                  <button
                    onClick={fecharPainel}
                    className="h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white"
                  >
                    <X size={15} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 space-y-5 text-sm">
              {carregandoPainel ? (
                <p className="text-zinc-400">Carregando informações...</p>
              ) : (
                <>
                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                      Resumo
                    </h3>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                        <p className="text-xs text-zinc-500">Elenco</p>
                        <p className="mt-1 text-zinc-100 font-medium">
                          {elencoCompleto.length}
                        </p>
                      </div>
                      <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                        <p className="text-xs text-zinc-500">Coreografias</p>
                        <p className="mt-1 text-zinc-100 font-medium">
                          {detalheInscricao?.detalhamento?.coreografias
                            ?.length ?? 0}
                        </p>
                      </div>
                    </div>
                  </section>

                  {detalheInscricao?.escola ? (
                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                      <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                        Dados da escola
                      </h3>

                      <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">
                            Nome da escola
                          </p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao.escola.nome}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">E-mail</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao.escola.email}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">WhatsApp</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao.escola.whatsapp}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">Direção</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao.escola.nomeDiretor}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2 sm:col-span-2">
                          <p className="text-xs text-zinc-500">Endereço</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao.escola.endereco}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">
                            Limite de coreografias
                          </p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao.escola.limiteCoreografias}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">
                            ID da inscrição
                          </p>
                          <p className="mt-1 text-zinc-100 break-all">
                            {detalheInscricao.escola.id}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-lg border border-zinc-800 bg-black/20 p-3">
                        <p className="text-xs text-zinc-500 uppercase tracking-[0.12em]">
                          Profissionais cadastrados
                        </p>

                        {(detalheInscricao.escola.profissionais?.length ??
                          0) === 0 ? (
                          <p className="mt-2 text-sm text-zinc-500">
                            Nenhum profissional cadastrado.
                          </p>
                        ) : (
                          <div className="mt-2 space-y-2">
                            {detalheInscricao.escola.profissionais.map(
                              (profissional: any) => (
                                <div
                                  key={profissional.id}
                                  className="rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 flex items-center justify-between gap-3"
                                >
                                  <div>
                                    <p className="text-sm text-zinc-100">
                                      {profissional.nome}
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                      {profissional.funcao === "COREOGRAFO"
                                        ? "Coreógrafo(a)"
                                        : "Assistente"}
                                    </p>
                                  </div>
                                  {profissional.ehExtra && (
                                    <span className="rounded-full border border-orange-300/35 bg-orange-500/10 px-2 py-0.5 text-[11px] text-orange-100">
                                      Extra (R$ 70,00)
                                    </span>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </section>
                  ) : (
                    <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                      <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                        Dados da inscrição independente
                      </h3>

                      <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">Responsável</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao?.independente?.nomeResponsavel}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">E-mail</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao?.independente?.email}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">WhatsApp</p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao?.independente?.whatsapp}
                          </p>
                        </div>
                        <div className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                          <p className="text-xs text-zinc-500">
                            Limite de coreografias
                          </p>
                          <p className="mt-1 text-zinc-100">
                            {detalheInscricao?.independente?.limiteCoreografias}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}

                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                      Elenco
                    </h3>
                    {elencoCompleto.length === 0 ? (
                      <p className="mt-3 text-zinc-500">
                        Nenhum bailarino cadastrado.
                      </p>
                    ) : (
                      <>
                        <div className="mt-3 hidden md:block overflow-hidden rounded-lg border border-zinc-800 bg-black/20">
                          <table className="w-full text-xs">
                            <thead className="bg-zinc-900/70 text-zinc-400">
                              <tr className="border-b border-zinc-800">
                                <th className="px-3 py-2 text-left font-medium">Nome artístico</th>
                                <th className="px-3 py-2 text-left font-medium">Nome completo</th>
                                <th className="px-3 py-2 text-left font-medium">Documento</th>
                                <th className="px-3 py-2 text-left font-medium">Nascimento</th>
                              </tr>
                            </thead>
                            <tbody>
                              {elencoCompleto.map((bailarino) => (
                                <tr
                                  key={bailarino.id}
                                  className="border-b border-zinc-800/70 last:border-b-0 text-zinc-200"
                                >
                                  <td className="px-3 py-2.5">{bailarino.nomeArtistico}</td>
                                  <td className="px-3 py-2.5">{bailarino.nomeCompleto}</td>
                                  <td className="px-3 py-2.5">
                                    {bailarino.tipoDocumento}:{" "}
                                    {formatarDocumento(
                                      bailarino.tipoDocumento,
                                      bailarino.documento,
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5">
                                    {formatarDataSomente(bailarino.dataNascimento)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-3 space-y-2 md:hidden">
                          {elencoCompleto.map((bailarino) => (
                            <div
                              key={bailarino.id}
                              className="rounded-lg border border-zinc-800 bg-black/20 px-3 py-3"
                            >
                              <p className="text-sm text-zinc-100 font-medium">
                                {bailarino.nomeArtistico}
                              </p>
                              {bailarino.nomeCompleto !== bailarino.nomeArtistico && (
                                <p className="mt-1 text-xs text-zinc-400">
                                  {bailarino.nomeCompleto}
                                </p>
                              )}
                              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-300">
                                <span>
                                  {bailarino.tipoDocumento}:{" "}
                                  {formatarDocumento(
                                    bailarino.tipoDocumento,
                                    bailarino.documento,
                                  )}
                                </span>
                                <span className="text-zinc-600">•</span>
                                <span>{formatarDataSomente(bailarino.dataNascimento)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </section>

                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                      Coreografias
                    </h3>
                    {(detalheInscricao?.detalhamento?.coreografias?.length ??
                      0) === 0 ? (
                      <p className="mt-3 text-zinc-500">
                        Nenhuma coreografia cadastrada.
                      </p>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {detalheInscricao.detalhamento.coreografias.map(
                          (coreografia: any) => (
                            <details
                              key={coreografia.id}
                              className="group rounded-lg border border-zinc-800 bg-black/20"
                            >
                              <summary className="list-none cursor-pointer px-3 py-3">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-zinc-100 font-medium">
                                      {coreografia.nome}
                                    </p>
                                    <p className="mt-1 text-xs text-zinc-500">
                                      {coreografia.formacao} •{" "}
                                      {coreografia.modalidade} •{" "}
                                      {coreografia.bailarinos} bailarinos
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-xs text-orange-200 font-medium">
                                      {formatarMoeda(coreografia.valor)}
                                    </p>
                                    <ChevronDown
                                      size={14}
                                      className="text-zinc-400 transition-transform group-open:rotate-180"
                                    />
                                  </div>
                                </div>
                              </summary>

                              <div className="border-t border-zinc-800 px-3 py-3 space-y-3">
                                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                  <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2">
                                    <p className="text-zinc-500">
                                      Coreógrafo(a)
                                    </p>
                                    <p className="mt-1 text-zinc-100">
                                      {coreografia.nomeCoreografo}
                                    </p>
                                  </div>
                                  <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2">
                                    <p className="text-zinc-500">Categoria</p>
                                    <p className="mt-1 text-zinc-100">
                                      {coreografia.categoria}
                                    </p>
                                  </div>
                                  <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2">
                                    <p className="text-zinc-500">Duração</p>
                                    <p className="mt-1 text-zinc-100">
                                      {coreografia.duracao}
                                    </p>
                                  </div>
                                  <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2">
                                    <p className="text-zinc-500">Cenário</p>
                                    <p className="mt-1 text-zinc-100">
                                      {coreografia.temCenario ? "Sim" : "Não"}
                                    </p>
                                  </div>
                                  <div className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2 sm:col-span-2">
                                    <p className="text-zinc-500">Música</p>
                                    <p className="mt-1 text-zinc-100 break-all">
                                      {coreografia.musica}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-500 mb-2">
                                    Elenco da coreografia
                                  </p>
                                  {(coreografia.listaBailarinos?.length ??
                                    0) === 0 ? (
                                    <p className="text-xs text-zinc-500">
                                      Sem bailarinos vinculados.
                                    </p>
                                  ) : (
                                    <div className="grid sm:grid-cols-2 gap-2">
                                      {coreografia.listaBailarinos.map(
                                        (bailarino: any) => (
                                          <div
                                            key={bailarino.id}
                                            className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-2"
                                          >
                                            <p className="text-xs text-zinc-100">
                                              {bailarino.nomeArtistico ||
                                                bailarino.nomeCompleto}
                                            </p>
                                            {bailarino.nomeArtistico && (
                                              <p className="text-[11px] text-zinc-500">
                                                {bailarino.nomeCompleto}
                                              </p>
                                            )}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </details>
                          ),
                        )}
                      </div>
                    )}
                  </section>

                  <section className="rounded-xl border border-zinc-800 bg-zinc-900/45 p-4">
                    <h3 className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                      Composição do valor
                    </h3>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                        <span className="text-zinc-300">
                          Subtotal coreografias
                        </span>
                        <span className="font-medium text-zinc-100">
                          {formatarMoeda(valorCoreografiasDetalhe)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-black/20 px-3 py-2">
                        <span className="text-zinc-300">
                          Profissionais extras
                          {qtdProfissionaisExtrasDetalhe > 0
                            ? ` (${qtdProfissionaisExtrasDetalhe} x R$ 70,00)`
                            : ""}
                        </span>
                        <span className="font-medium text-zinc-100">
                          {formatarMoeda(valorProfissionaisExtrasDetalhe)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-orange-300/25 bg-orange-500/10 px-3 py-2">
                        <span className="font-medium text-orange-100">
                          Total
                        </span>
                        <span className="font-semibold text-orange-100">
                          {formatarMoeda(valorTotalDetalhe)}
                        </span>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {inscricaoParaExcluir && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <button
            onClick={fecharModalExclusao}
            className="absolute inset-0 bg-black/70"
            aria-label="Fechar confirmação de exclusão"
          />

          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-700 bg-zinc-950 p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  TEM CERTEZA DISSO?
                </h3>
                <p className="mt-1 text-sm text-zinc-300">
                  Esta ação excluirá a inscrição e todos os dados vinculados:
                  elenco, profissionais e coreografias.
                </p>
                <p className="mt-2 text-sm text-orange-200">
                  Inscrição:{" "}
                  <span className="font-medium">
                    {inscricaoParaExcluir.nome}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              {erroExclusao && (
                <p className="mr-auto text-sm text-red-300">{erroExclusao}</p>
              )}
              <button
                onClick={fecharModalExclusao}
                disabled={Boolean(excluindoId)}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                disabled={Boolean(excluindoId)}
                className="rounded-lg border border-red-300/35 bg-red-500/15 px-4 py-2 text-sm text-red-100 hover:bg-red-500/25 disabled:opacity-60"
              >
                {excluindoId ? "Excluindo..." : "Sim, excluir inscrição"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
