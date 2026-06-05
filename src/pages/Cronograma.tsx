import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock3,
  Radio,
  Star,
  Theater,
} from "lucide-react";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";
import { listarCronograma } from "../lib/api";
import type { ItemCronograma } from "../lib/api";

const INTERVALO_ATUALIZACAO_CRONOGRAMA = 5000;

function Etiqueta({
  children,
  destaque = false,
}: {
  children: ReactNode;
  destaque?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${
        destaque
          ? "border-rose-300/45 bg-rose-500/15 text-rose-100"
          : "border-white/10 bg-white/5 text-zinc-300"
      }`}
    >
      {children}
    </span>
  );
}

function CardCoreografia({
  item,
}: {
  item: ItemCronograma;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-xl border p-4 transition duration-300 ${
        item.concluidaCronograma
          ? "border-emerald-300/25 bg-emerald-500/10"
          : "border-zinc-800 bg-zinc-950/60 hover:border-orange-400/45 hover:bg-zinc-900/80"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${
            item.concluidaCronograma
              ? "border-emerald-300/40 bg-emerald-500/15 text-emerald-100"
              : "border-orange-300/35 bg-orange-500/15 text-orange-100"
          }`}
        >
          {item.concluidaCronograma ? (
            <CheckCircle2 size={18} />
          ) : (
            item.ordemCronograma
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{item.nome}</h3>
            {item.concluidaCronograma && (
              <Etiqueta destaque>Apresentada</Etiqueta>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-300">{item.escola}</p>
          {item.coreografo && (
            <p className="mt-1 text-xs text-zinc-500">Coreógrafo: {item.coreografo}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {item.contexto && <Etiqueta>{item.contexto}</Etiqueta>}
            {item.elenco && <Etiqueta>{item.elenco}</Etiqueta>}
            {item.tempo && <Etiqueta>{item.tempo}</Etiqueta>}
          </div>
        </div>
      </div>
    </article>
  );
}

function NumeroDestaque({
  numero,
  variante,
}: {
  numero: number;
  variante: "agora" | "proxima";
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] ${
        variante === "agora"
          ? "border-orange-300/45 bg-orange-500/15 text-orange-100"
          : "border-cyan-200/30 bg-cyan-500/10 text-cyan-100"
      }`}
    >
      <span className="text-sm">{String(numero).padStart(2, "0")}</span>
      <span>{variante === "agora" ? "Em cena" : "Próxima"}</span>
    </div>
  );
}

export default function Cronograma() {
  const [itens, setItens] = useState<ItemCronograma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;
    let primeiraCarga = true;

    function carregarCronograma() {
      listarCronograma()
        .then((dados) => {
          if (!ativo) return;
          setItens(dados || []);
          setErro("");
        })
        .catch((error) => {
          if (!ativo || !primeiraCarga) return;
          setErro(error instanceof Error ? error.message : "Erro ao carregar cronograma.");
        })
        .finally(() => {
          if (!ativo) return;
          setCarregando(false);
          primeiraCarga = false;
        });
    }

    carregarCronograma();
    const intervalo = window.setInterval(
      carregarCronograma,
      INTERVALO_ATUALIZACAO_CRONOGRAMA,
    );

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
    };
  }, []);

  const pendentes = useMemo(
    () => itens.filter((item) => !item.concluidaCronograma),
    [itens],
  );
  const concluidas = useMemo(
    () => itens.filter((item) => item.concluidaCronograma),
    [itens],
  );

  const agora = pendentes[0];
  const aSeguir = pendentes[1];
  const cronogramaRestante = pendentes.slice(2);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-6 text-white md:px-10 md:py-8">
      <FundoFestival variante="padrao" />

      <div className="relative z-20 mx-auto max-w-6xl">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <header className="rounded-2xl border border-zinc-800 bg-zinc-950/65 p-5 backdrop-blur-sm md:p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
            Festival ao vivo
          </p>
          <h1 className="mt-2 font-primary text-3xl text-white md:text-4xl">
            Palco em movimento
          </h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">
            A ordem viva do festival: quem está em cena, quem entra em seguida
            e a sequência completa das apresentações.
          </p>
        </header>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-5 py-10 text-center text-sm text-gray-400">
            Carregando cronograma...
          </div>
        ) : itens.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/70 px-5 py-10 text-center text-sm text-gray-400">
            O cronograma ainda não está disponível.
          </div>
        ) : (
          <>
            <section className="mt-6 space-y-4">
              <article className="relative overflow-hidden rounded-2xl border border-orange-400/30 bg-zinc-950/70 p-5 shadow-md backdrop-blur-sm md:p-8">
                <div className="absolute right-5 top-5 inline-flex animate-pulse items-center gap-2 rounded-full border border-red-300/45 bg-red-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-100">
                  <Radio size={14} />
                  Ao vivo
                </div>
                {agora ? (
                  <div className="max-w-5xl">
                    <NumeroDestaque numero={agora.ordemCronograma} variante="agora" />
                    <h2 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                      {agora.nome}
                    </h2>
                    <p className="mt-5 text-lg text-gray-300 md:text-2xl">{agora.escola}</p>
                    {agora.coreografo && (
                      <p className="mt-3 text-sm text-gray-400 md:text-base">
                        Coreógrafo: {agora.coreografo}
                      </p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {agora.contexto && <Etiqueta destaque>{agora.contexto}</Etiqueta>}
                      {agora.elenco && <Etiqueta destaque>{agora.elenco}</Etiqueta>}
                      {agora.tempo && <Etiqueta destaque>{agora.tempo}</Etiqueta>}
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-base text-gray-300">
                    Todas as coreografias pendentes já foram apresentadas.
                  </p>
                )}
              </article>

              <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 shadow-md backdrop-blur-sm md:p-5">
                {aSeguir ? (
                  <div className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                    <NumeroDestaque numero={aSeguir.ordemCronograma} variante="proxima" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-cyan-100">
                        <Clock3 size={15} />
                        <p className="text-xs uppercase tracking-[0.18em]">A seguir</p>
                      </div>
                      <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
                        {aSeguir.nome}
                      </h2>
                      <p className="mt-2 text-sm text-gray-300 md:text-base">{aSeguir.escola}</p>
                      {aSeguir.coreografo && (
                        <p className="mt-2 text-xs text-gray-500">
                          Coreógrafo: {aSeguir.coreografo}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {aSeguir.contexto && <Etiqueta>{aSeguir.contexto}</Etiqueta>}
                      {aSeguir.tempo && <Etiqueta>{aSeguir.tempo}</Etiqueta>}
                    </div>
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-gray-400">
                    Não há próxima coreografia pendente.
                  </p>
                )}
              </article>
            </section>

            <section className="mt-6">
              <section className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-md backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2 text-zinc-100">
                  <Theater size={18} />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
                    Cronograma completo
                  </h2>
                </div>

                {cronogramaRestante.length > 0 ? (
                  <div className="space-y-3">
                    {cronogramaRestante.map((item) => (
                      <CardCoreografia key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">
                    Não há outras coreografias pendentes além das destacadas.
                  </p>
                )}
              </section>
            </section>

            {concluidas.length > 0 && (
              <section className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-5">
                <div className="flex items-center gap-2 text-emerald-100">
                  <Star size={17} />
                  <h2 className="text-sm font-semibold uppercase tracking-[0.16em]">
                    Já passaram pelo palco
                  </h2>
                </div>
                <p className="mt-3 text-sm text-emerald-50/80">
                  As coreografias concluídas continuam visíveis no cronograma completo,
                  marcadas como apresentadas.
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
