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

function pluralizarBailarinos(quantidade: number) {
  return quantidade === 1 ? "1 bailarino" : `${quantidade} bailarinos`;
}

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
  indice,
}: {
  item: ItemCronograma;
  indice: number;
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
          {item.concluidaCronograma ? <CheckCircle2 size={18} /> : indice + 1}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{item.nome}</h3>
            {item.concluidaCronograma && (
              <Etiqueta destaque>Apresentada</Etiqueta>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-300">{item.escola}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Etiqueta>{formatarEnum(item.formacao)}</Etiqueta>
            <Etiqueta>{formatarEnum(item.modalidade)}</Etiqueta>
            <Etiqueta>{formatarEnum(item.categoria)}</Etiqueta>
            <Etiqueta>{pluralizarBailarinos(item.quantidadeBailarinos)}</Etiqueta>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Cronograma() {
  const [itens, setItens] = useState<ItemCronograma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
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
          <h1 className="mt-2 font-primary text-3xl text-white md:text-5xl">
            Cronograma das apresentações
          </h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">
            Acompanhe a ordem do palco em tempo real: a coreografia em exibição,
            a próxima entrada e toda a sequência do festival.
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
            <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <article className="relative overflow-hidden rounded-2xl border border-orange-400/30 bg-zinc-950/70 p-5 shadow-md backdrop-blur-sm md:p-7">
                <div className="absolute right-5 top-5 inline-flex animate-pulse items-center gap-2 rounded-full border border-red-300/45 bg-red-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-100">
                  <Radio size={14} />
                  Ao vivo
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                  Agora no palco
                </p>
                {agora ? (
                  <div className="mt-6">
                    <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white md:text-4xl">
                      {agora.nome}
                    </h2>
                    <p className="mt-4 text-base text-gray-300 md:text-lg">{agora.escola}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Etiqueta destaque>{formatarEnum(agora.formacao)}</Etiqueta>
                      <Etiqueta destaque>{formatarEnum(agora.modalidade)}</Etiqueta>
                      <Etiqueta destaque>{formatarEnum(agora.categoria)}</Etiqueta>
                      <Etiqueta destaque>
                        {pluralizarBailarinos(agora.quantidadeBailarinos)}
                      </Etiqueta>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 text-base text-gray-300">
                    Todas as coreografias pendentes já foram apresentadas.
                  </p>
                )}
              </article>

              <article className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-md backdrop-blur-sm md:p-6">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Clock3 size={17} />
                  <p className="text-xs uppercase tracking-[0.18em]">A seguir</p>
                </div>
                {aSeguir ? (
                  <div className="mt-5">
                    <h2 className="text-2xl font-semibold text-white">{aSeguir.nome}</h2>
                    <p className="mt-3 text-sm text-gray-300">{aSeguir.escola}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Etiqueta>{formatarEnum(aSeguir.formacao)}</Etiqueta>
                      <Etiqueta>{formatarEnum(aSeguir.modalidade)}</Etiqueta>
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
                    {cronogramaRestante.map((item, index) => (
                      <CardCoreografia key={item.id} item={item} indice={index + 2} />
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
