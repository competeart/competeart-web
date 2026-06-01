import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink,
  FileText,
  Gavel,
  Lock,
  LogOut,
  MapPin,
  Menu,
  PencilLine,
  Shield,
  TicketCheck,
  X,
  Home,
} from "lucide-react";
import { abrirRegulamentoEmNovaAba } from "../../lib/regulamento";

interface HeaderSiteProps {
  className?: string;
  sobreFundo?: boolean;
}

function ItemMenuAtivo({
  icone: Icone,
  titulo,
  subtitulo,
  onClick,
  externo = false,
  restrito = false,
}: {
  icone: typeof Shield;
  titulo: string;
  subtitulo: string;
  onClick: () => void;
  externo?: boolean;
  restrito?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-zinc-900/70"
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          restrito
            ? "bg-cyan-500/10 text-cyan-200"
            : "bg-orange-500/10 text-orange-300"
        }`}
      >
        <Icone size={16} />
      </span>
      <span>
        <span className="block text-sm font-medium text-white">{titulo}</span>
        <span className="block text-xs text-gray-400">{subtitulo}</span>
      </span>
      {externo && (
        <span className="ml-auto text-zinc-400">
          <ExternalLink size={15} />
        </span>
      )}
    </button>
  );
}

function DivisaoAdministrativa() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-px flex-1 bg-zinc-800" />
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-zinc-500">
        <Lock size={13} />
      </span>
      <div className="h-px flex-1 bg-zinc-800" />
    </div>
  );
}

export default function HeaderSite({ className = "", sobreFundo = false }: HeaderSiteProps) {
  const navegar = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const adminLogado = Boolean(localStorage.getItem("admin-token"));
  const moderadorLogado = Boolean(localStorage.getItem("checkin-token"));

  function sairAdmin() {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("checkin-token");
    setMenuAberto(false);
    navegar("/admin/login");
  }

  function abrirRegulamento() {
    setMenuAberto(false);
    abrirRegulamentoEmNovaAba();
  }

  return (
    <div className={`relative z-40 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navegar("/")}
          className={`rounded-full border px-3 py-2 transition flex items-center justify-center ${
            sobreFundo
              ? "border-zinc-700 bg-black/70 hover:bg-zinc-900"
              : "border-zinc-800 bg-zinc-950/70 hover:bg-zinc-900"
          }`}
          aria-label="Ir para a página inicial"
        >
          <img src="/assets/logo-white.png" alt="Compete'Art" className="h-6 w-auto" />
        </button>

        <button
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className={`p-3 rounded-full border text-white transition ${
            sobreFundo
              ? "border-zinc-700 bg-black/70 hover:bg-zinc-900"
              : "border-zinc-800 bg-zinc-950/70 hover:bg-zinc-900"
          }`}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          {menuAberto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <button
        type="button"
        aria-label="Fechar menu"
        onClick={() => setMenuAberto(false)}
        className={`fixed inset-0 z-50 bg-black/65 backdrop-blur-[1px] transition-opacity duration-300 ${
          menuAberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!menuAberto}
        aria-label="Menu de navegação"
        className={`fixed right-0 top-0 z-[60] h-dvh w-[min(88vw,22rem)] border-l border-zinc-800 bg-zinc-950/98 shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out md:w-[22vw] md:min-w-[320px] md:max-w-[420px] lg:w-[20vw] ${
          menuAberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-end border-b border-zinc-800 px-4 py-4">
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-black/40 text-gray-200 transition hover:border-orange-400/50 hover:text-white"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="min-h-0 flex-1 divide-y divide-zinc-800 overflow-y-auto">
          <ItemMenuAtivo
            icone={Home}
            titulo="Início"
            subtitulo="Página principal"
            onClick={() => {
              setMenuAberto(false);
              navegar("/");
            }}
          />
          <ItemMenuAtivo
            icone={Gavel}
            titulo="Jurados"
            subtitulo="Conheça os avaliadores"
            onClick={() => {
              setMenuAberto(false);
              navegar("/jurados");
            }}
          />
          <ItemMenuAtivo
            icone={MapPin}
            titulo="Localização"
            subtitulo="Mapa e acesso ao teatro"
            onClick={() => {
              setMenuAberto(false);
              navegar("/localizacao");
            }}
          />
          <ItemMenuAtivo
            icone={FileText}
            titulo="Regulamento"
            subtitulo="Regras oficiais do festival"
            onClick={abrirRegulamento}
            externo
          />
          {!adminLogado && !moderadorLogado && (
            <ItemMenuAtivo
              icone={Shield}
              titulo="Login"
              subtitulo="Entrar com chave de acesso"
              onClick={() => {
                setMenuAberto(false);
                navegar("/admin/login");
              }}
            />
          )}

          {(adminLogado || moderadorLogado) && (
            <>
              <DivisaoAdministrativa />
              <ItemMenuAtivo
                icone={TicketCheck}
                titulo="Check-in de participantes"
                subtitulo="Buscar e confirmar presença"
                restrito
                onClick={() => {
                  setMenuAberto(false);
                  navegar("/check-in");
                }}
              />
            </>
          )}

          {adminLogado && (
            <>
              <ItemMenuAtivo
                icone={PencilLine}
                titulo="Editar cronograma"
                subtitulo="Ordenar e concluir coreografias"
                restrito
                onClick={() => {
                  setMenuAberto(false);
                  navegar("/coreografias/editar");
                }}
              />
              <ItemMenuAtivo
                icone={Shield}
                titulo="Painel administrativo"
                subtitulo="Relatório de inscrições"
                restrito
                onClick={() => {
                  setMenuAberto(false);
                  navegar("/admin");
                }}
              />
            </>
          )}

          {(adminLogado || moderadorLogado) && (
            <button
              onClick={sairAdmin}
              className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-red-500/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-200">
                <LogOut size={16} />
              </span>
              <span>
                <span className="block text-sm font-medium text-red-100">
                  Encerrar sessão
                </span>
                <span className="block text-xs text-red-200/70">Encerrar sessão atual</span>
              </span>
            </button>
          )}
          </div>
        </div>
      </aside>
    </div>
  );
}
