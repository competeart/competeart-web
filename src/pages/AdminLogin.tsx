import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { validarAdmin } from "../lib/api";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";

export default function AdminLogin() {
  const [token, setToken] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [validando, setValidando] = useState(false);
  const [verificandoSessao, setVerificandoSessao] = useState(true);
  const navegar = useNavigate();

  useEffect(() => {
    async function validarSessaoExistente() {
      const tokenSalvo = localStorage.getItem("admin-token");

      if (!tokenSalvo) {
        setVerificandoSessao(false);
        return;
      }

      try {
        const chaveValida = await validarAdmin(tokenSalvo);

        if (chaveValida) {
          navegar("/admin", { replace: true });
          return;
        }

        localStorage.removeItem("admin-token");
      } catch {
        localStorage.removeItem("admin-token");
      } finally {
        setVerificandoSessao(false);
      }
    }

    validarSessaoExistente();
  }, [navegar]);

  async function validarAcesso(evento?: FormEvent) {
    evento?.preventDefault();
    if (!token.trim() || validando) return;

    setMensagemErro("");
    setValidando(true);

    try {
      const chaveValida = await validarAdmin(token);

      if (!chaveValida) {
        setMensagemErro("Chave administrativa inválida.");
        setValidando(false);
        return;
      }

      localStorage.setItem("admin-token", token);
      navegar("/admin", { replace: true });
    } catch {
      setMensagemErro("Erro ao validar chave. Tente novamente.");
    } finally {
      setValidando(false);
    }
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <FundoFestival variante="admin" />

      <div className="relative z-10 px-6 py-6 md:px-10 md:py-8">
        <div className="max-w-6xl mx-auto">
          <HeaderSite sobreFundo />
        </div>
      </div>

      <div className="relative z-10 min-h-[calc(100vh-6rem)] px-6 md:px-10 pb-10 flex items-center">
        <div className="mx-auto w-full max-w-6xl grid gap-5 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 backdrop-blur-md p-6 md:p-8 shadow-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-orange-200">
              <ShieldCheck size={14} />
              Acesso restrito
            </div>

            <h1 className="mt-4 font-primary text-3xl md:text-4xl text-white">
              Painel administrativo
            </h1>

            <p className="mt-3 max-w-xl text-gray-300 leading-relaxed">
              Área para acompanhar inscrições, visualizar detalhamento das coreografias e
              consultar informações de escolas e bailarinos independentes.
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                  Gestão
                </p>
                <p className="mt-2 text-sm text-gray-200">Inscrições de escola e independentes</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                  Consulta
                </p>
                <p className="mt-2 text-sm text-gray-200">Valores, elenco e coreografias por inscrição</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-700 bg-zinc-950/78 backdrop-blur-xl p-6 md:p-7 shadow-2xl">
            <div className="flex items-center justify-center pb-5 border-b border-zinc-800">
              <img
                src="/assets/logo-white.png"
                alt="Compete'Art"
                className="w-40 md:w-48 drop-shadow-lg"
              />
            </div>

            <form onSubmit={validarAcesso} className="mt-5 flex flex-col gap-4">
              <label className="text-sm text-gray-300">Chave administrativa</label>
              <div className="relative">
                <KeyRound
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="password"
                  placeholder="Digite sua chave de acesso"
                  value={token}
                  onChange={(evento) => setToken(evento.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-700 bg-zinc-900/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-400/40"
                />
              </div>

              {mensagemErro && <p className="text-sm text-red-400">{mensagemErro}</p>}

              <button
                type="submit"
                disabled={validando || verificandoSessao}
                className="mt-1 px-6 py-3 rounded-xl bg-orange-500 text-black font-semibold transition-all hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {verificandoSessao
                  ? "Verificando sessão..."
                  : validando
                    ? "Validando..."
                    : "Entrar no painel"}
              </button>

              <div className="pt-3 border-t border-zinc-800 text-xs text-gray-400">
                <p className="inline-flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cyan-300" />
                  Se você já estiver autenticado, o acesso ao login é redirecionado automaticamente.
                </p>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
