import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Gavel,
  Lock,
  LogOut,
  MapPin,
  Menu,
  Shield,
  Users,
  X,
  Home,
  PenSquare,
} from "lucide-react";

type ItemBloqueado = {
  titulo: string;
  subtitulo: string;
  icone: typeof Gavel;
};

const ITENS_BLOQUEADOS: ItemBloqueado[] = [
  { titulo: "Equipe", subtitulo: "Em breve", icone: Users },
];

interface HeaderSiteProps {
  className?: string;
  sobreFundo?: boolean;
}

function ItemMenuAtivo({
  icone: Icone,
  titulo,
  subtitulo,
  onClick,
}: {
  icone: typeof Shield;
  titulo: string;
  subtitulo: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl border border-zinc-800 bg-black/40 hover:bg-zinc-900 transition px-4 py-3 flex items-center gap-3"
    >
      <span className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-300">
        <Icone size={16} />
      </span>
      <span>
        <span className="block text-sm font-medium text-white">{titulo}</span>
        <span className="block text-xs text-gray-400">{subtitulo}</span>
      </span>
    </button>
  );
}

export default function HeaderSite({ className = "", sobreFundo = false }: HeaderSiteProps) {
  const navegar = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  const adminLogado = Boolean(localStorage.getItem("admin-token"));

  function sairAdmin() {
    localStorage.removeItem("admin-token");
    setMenuAberto(false);
    navegar("/admin/login");
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
          aria-label="Abrir menu"
        >
          {menuAberto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuAberto && (
        <div className="absolute top-16 right-0 z-50 w-80 rounded-2xl border border-zinc-700 bg-zinc-950/95 backdrop-blur-md p-3 shadow-2xl">
          <div className="space-y-2">
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
              icone={PenSquare}
              titulo="Inscrição"
              subtitulo="Iniciar cadastro"
              onClick={() => {
                setMenuAberto(false);
                navegar("/inscricao");
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
              subtitulo="Como chegar ao teatro"
              onClick={() => {
                setMenuAberto(false);
                navegar("/localizacao");
              }}
            />
            <ItemMenuAtivo
              icone={FileText}
              titulo="Regulamento"
              subtitulo="Regras oficiais do festival"
              onClick={() => {
                setMenuAberto(false);
                navegar("/regulamento");
              }}
            />
            <ItemMenuAtivo
              icone={Shield}
              titulo={adminLogado ? "Painel administrativo" : "Acesso administrativo"}
              subtitulo={
                adminLogado ? "Abrir dashboard de inscrições" : "Entrar com chave de acesso"
              }
              onClick={() => {
                setMenuAberto(false);
                navegar(adminLogado ? "/admin" : "/admin/login");
              }}
            />

            {adminLogado && (
              <button
                onClick={sairAdmin}
                className="w-full text-left rounded-xl border border-red-400/25 bg-red-500/10 hover:bg-red-500/20 transition px-4 py-3 flex items-center gap-3"
              >
                <span className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-400/30 flex items-center justify-center text-red-200">
                  <LogOut size={16} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-red-100">Sair do admin</span>
                  <span className="block text-xs text-red-200/70">Encerrar sessão atual</span>
                </span>
              </button>
            )}
          </div>

          <div className="my-3 h-px bg-zinc-800" />

          <div className="space-y-2">
            {ITENS_BLOQUEADOS.map((item) => {
              const Icone = item.icone;

              return (
                <div
                  key={item.titulo}
                  className="w-full rounded-xl border border-zinc-800 bg-black/30 px-4 py-3 flex items-center gap-3 opacity-75"
                >
                  <span className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Icone size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-white">{item.titulo}</span>
                    <span className="block text-xs text-gray-400">{item.subtitulo}</span>
                  </span>
                  <span className="w-7 h-7 rounded-md border border-zinc-800 bg-zinc-950 flex items-center justify-center text-zinc-400">
                    <Lock size={13} />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
