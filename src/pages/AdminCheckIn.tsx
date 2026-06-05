import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  TicketCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";
import {
  buscarParticipantesCheckIn,
  fazerCheckInParticipante,
  listarEscolasCheckIn,
} from "../lib/api";

type ParticipanteCheckIn = {
  id: string;
  bailarinoId: string | null;
  nomeCompleto: string;
  tipoDocumento: "CPF" | "RG" | "NAO_INFORMADO";
  documento: string;
  coreografiaId: string | null;
  coreografia: string;
  escola: string;
  tipoInscricao: "ESCOLA" | "BAILARINO_INDEPENDENTE" | "DIRETOR";
  fezCheckIn: boolean;
};

type EscolaCheckIn = {
  id: string;
  nome: string;
};

type FiltroCheckIn = "TODOS" | "FEITO" | "PENDENTE";

function formatarDocumento(tipoDocumento: ParticipanteCheckIn["tipoDocumento"], documento: string) {
  if (tipoDocumento === "NAO_INFORMADO") {
    return "Não informado";
  }

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

function formatarTipoInscricao(tipoInscricao: ParticipanteCheckIn["tipoInscricao"]) {
  if (tipoInscricao === "DIRETOR") return "Diretor(a)";
  if (tipoInscricao === "ESCOLA") return "Escola";
  return "Bailarino independente";
}

export default function AdminCheckIn() {
  const navegar = useNavigate();
  const [termoBusca, setTermoBusca] = useState("");
  const [participantes, setParticipantes] = useState<ParticipanteCheckIn[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [termoConsultado, setTermoConsultado] = useState("");
  const [participanteEmCheckIn, setParticipanteEmCheckIn] = useState<string | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [filtroCheckIn, setFiltroCheckIn] = useState<FiltroCheckIn>("TODOS");
  const [escolaSelecionada, setEscolaSelecionada] = useState("");
  const [escolas, setEscolas] = useState<EscolaCheckIn[]>([]);
  const [carregandoEscolas, setCarregandoEscolas] = useState(false);
  const termoLimpo = termoBusca.trim();
  const adminLogado = Boolean(localStorage.getItem("admin-token"));
  const consultaAtual = `${termoLimpo}|${filtroCheckIn}|${escolaSelecionada}`;
  const totalFiltrosAtivos =
    (filtroCheckIn !== "TODOS" ? 1 : 0) + (escolaSelecionada ? 1 : 0);

  useEffect(() => {
    const tokenCheckIn = localStorage.getItem("checkin-token");
    const tokenAdmin = localStorage.getItem("admin-token");

    if (!tokenCheckIn && !tokenAdmin) navegar("/check-in/login");
  }, [navegar]);

  useEffect(() => {
    let ativo = true;
    setCarregandoEscolas(true);

    listarEscolasCheckIn()
      .then((dados) => {
        if (!ativo) return;
        setEscolas(dados || []);
      })
      .catch(() => {
        if (!ativo) return;
        setEscolas([]);
      })
      .finally(() => {
        if (ativo) setCarregandoEscolas(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (termoLimpo.length < 2) {
      return;
    }

    let ativo = true;

    const temporizador = window.setTimeout(() => {
      setCarregando(true);
      setMensagemErro("");
      setTermoConsultado(consultaAtual);

      buscarParticipantesCheckIn(termoLimpo, {
        checkIn: filtroCheckIn,
        escolaId: escolaSelecionada || undefined,
      })
        .then((dados) => {
          if (!ativo) return;
          setParticipantes(dados || []);
        })
        .catch((error) => {
          if (!ativo) return;
          setParticipantes([]);
          setMensagemErro(
            error?.message || "Não foi possível buscar participantes.",
          );
        })
        .finally(() => {
          if (ativo) setCarregando(false);
        });
    }, 350);

    return () => {
      ativo = false;
      window.clearTimeout(temporizador);
    };
  }, [consultaAtual, escolaSelecionada, filtroCheckIn, termoLimpo]);

  const buscaAtualizada = termoConsultado === consultaAtual;
  const carregandoVisivel =
    termoLimpo.length >= 2 && (carregando || !buscaAtualizada);
  const mensagemErroVisivel =
    termoLimpo.length >= 2 && buscaAtualizada ? mensagemErro : "";
  const participantesVisiveis = buscaAtualizada ? participantes : [];

  async function marcarCheckIn(participanteId: string) {
    if (participanteEmCheckIn) return;

    setParticipanteEmCheckIn(participanteId);
    setMensagemErro("");

    try {
      await fazerCheckInParticipante(participanteId);
      setParticipantes((atuais) =>
        atuais
          .map((participante) =>
            participante.id === participanteId
              ? { ...participante, fezCheckIn: true }
              : participante,
          )
          .filter((participante) => {
            if (filtroCheckIn === "PENDENTE") return !participante.fezCheckIn;
            if (filtroCheckIn === "FEITO") return participante.fezCheckIn;
            return true;
          })
          .sort((a, b) => Number(a.fezCheckIn) - Number(b.fezCheckIn)),
      );
    } catch (error) {
      setMensagemErro(
        error instanceof Error
          ? error.message
          : "Não foi possível fazer check-in.",
      );
    } finally {
      setParticipanteEmCheckIn(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-8 md:py-10">
      <FundoFestival variante="admin" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-orange-200">
              <TicketCheck size={14} />
              Check-in
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-primary text-orange-400">
              Busca de participantes
            </h1>
            <p className="mt-2 text-sm text-zinc-300">
              Consulte participantes e diretores por nome ou CPF para localizar escola.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navegar(adminLogado ? "/admin" : "/")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-200 transition hover:border-orange-300/45"
          >
            <ArrowLeft size={15} />
            {adminLogado ? "Painel" : "Início"}
          </button>
        </div>

        <section className="mb-4 rounded-xl border border-zinc-800 bg-zinc-950/75 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="flex-1">
              <label htmlFor="busca-check-in" className="text-sm text-zinc-300">
                Nome ou CPF
              </label>
              <div className="relative mt-2">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
                <input
                  id="busca-check-in"
                  value={termoBusca}
                  onChange={(evento) => setTermoBusca(evento.target.value)}
                  placeholder="Digite nome ou CPF"
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-orange-300/45"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFiltrosAbertos((aberto) => !aberto)}
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm transition ${
                totalFiltrosAtivos > 0
                  ? "border-orange-300/50 bg-orange-500/15 text-orange-100"
                  : "border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-orange-300/45"
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtros
              {totalFiltrosAtivos > 0 && (
                <span className="rounded-full bg-orange-300 px-2 py-0.5 text-xs font-semibold text-black">
                  {totalFiltrosAtivos}
                </span>
              )}
            </button>
          </div>

          {filtrosAbertos && (
            <div className="mt-4 grid gap-3 border-t border-zinc-800 pt-4 md:grid-cols-2">
              <div>
                <label htmlFor="filtro-check-in" className="text-sm text-zinc-300">
                  Status do check-in
                </label>
                <select
                  id="filtro-check-in"
                  value={filtroCheckIn}
                  onChange={(evento) =>
                    setFiltroCheckIn(evento.target.value as FiltroCheckIn)
                  }
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:border-orange-300/45"
                >
                  <option value="TODOS">Todos os participantes</option>
                  <option value="FEITO">Somente check-in já feito</option>
                  <option value="PENDENTE">Somente check-in ainda não feito</option>
                </select>
              </div>

              <div>
                <label htmlFor="filtro-escola" className="text-sm text-zinc-300">
                  Escola
                </label>
                <select
                  id="filtro-escola"
                  value={escolaSelecionada}
                  onChange={(evento) => setEscolaSelecionada(evento.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 text-sm text-white focus:outline-none focus:border-orange-300/45"
                >
                  <option value="">
                    {carregandoEscolas ? "Carregando escolas..." : "Todas as escolas"}
                  </option>
                  {escolas.map((escola) => (
                    <option key={escola.id} value={escola.id}>
                      {escola.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <p className="mt-2 text-xs text-zinc-500">
            A busca é feita automaticamente enquanto você digita.
          </p>
        </section>

        {termoLimpo.length < 2 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 px-4 py-8 text-center text-sm text-zinc-500">
            Digite ao menos 2 letras para iniciar a busca.
          </div>
        ) : mensagemErroVisivel ? (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {mensagemErroVisivel}
          </div>
        ) : carregandoVisivel ? (
          <p className="text-sm text-zinc-400">Buscando participantes...</p>
        ) : participantesVisiveis.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950/65 px-4 py-8 text-center text-sm text-zinc-500">
            Nenhum participante encontrado para o termo informado.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/75">
            <table className="w-full min-w-[840px] text-sm">
              <thead className="bg-zinc-900/85">
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="px-4 py-3 text-left font-medium">Nome completo</th>
                  <th className="px-4 py-3 text-left font-medium">Documento</th>
                  <th className="px-4 py-3 text-left font-medium">Escola</th>
                  <th className="px-4 py-3 text-right font-medium">Check-in</th>
                </tr>
              </thead>

              <tbody>
                {participantesVisiveis.map((participante) => (
                  <tr
                    key={participante.id}
                    className={`border-b border-zinc-900/90 last:border-b-0 transition ${
                      participante.fezCheckIn
                        ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                        : "hover:bg-zinc-900/45"
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <p
                        className={`text-sm font-medium ${
                          participante.fezCheckIn ? "text-emerald-100" : "text-white"
                        }`}
                      >
                        {participante.nomeCompleto}
                      </p>
                      {participante.fezCheckIn && (
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-emerald-200">
                          <CheckCircle2 size={13} />
                          Check-in realizado
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-200">
                      <span className="text-zinc-500">
                        {participante.tipoDocumento === "NAO_INFORMADO"
                          ? "CPF"
                          : participante.tipoDocumento}
                      </span>{" "}
                      {formatarDocumento(
                        participante.tipoDocumento,
                        participante.documento,
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-zinc-200">{participante.escola}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {formatarTipoInscricao(participante.tipoInscricao)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => marcarCheckIn(participante.id)}
                        disabled={participante.fezCheckIn || participanteEmCheckIn === participante.id}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed ${
                          participante.fezCheckIn
                            ? "border-emerald-300/40 bg-emerald-500/15 text-emerald-100"
                            : "border-orange-300/40 bg-orange-500/15 text-orange-100 hover:bg-orange-500/25"
                        }`}
                      >
                        {participante.fezCheckIn && <CheckCircle2 size={14} />}
                        {participante.fezCheckIn
                          ? "Check-in feito"
                          : participanteEmCheckIn === participante.id
                            ? "Registrando..."
                            : "Fazer check-in"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
