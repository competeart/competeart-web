import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { buscarEscolaAdmin, listarEscolasAdmin } from "../lib/api";
import HeaderSite from "../components/layout/HeaderSite";
import FundoFestival from "../components/layout/FundoFestival";

type InscricaoAdmin = {
  id: string;
  nome: string;
  limiteCoreografias: number;
  coreografiasCadastradas: number;
  valorTotal: number;
  tipoInscricao: "ESCOLA" | "BAILARINO_INDEPENDENTE";
  status: "COMPLETA" | "EM_ANDAMENTO";
};

export default function Admin() {
  const navegar = useNavigate();

  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
  const [detalheInscricao, setDetalheInscricao] = useState<any>(null);
  const [inscricoes, setInscricoes] = useState<InscricaoAdmin[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [coreografiaSelecionada, setCoreografiaSelecionada] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("admin-token");
    if (!token) navegar("/admin/login");
  }, [navegar]);

  useEffect(() => {
    listarEscolasAdmin()
      .then((dados) => setInscricoes(dados || []))
      .finally(() => setCarregandoLista(false));
  }, []);

  async function abrirDetalhes(id: string) {
    setIdSelecionado(id);
    setCoreografiaSelecionada(null);

    const dados = await buscarEscolaAdmin(id);
    setDetalheInscricao(dados);
  }

  function fecharDetalhes() {
    setIdSelecionado(null);
    setDetalheInscricao(null);
    setCoreografiaSelecionada(null);
  }

  const tituloDetalhes =
    detalheInscricao?.escola?.nome || detalheInscricao?.independente?.nomeResponsavel;

  function sairDoAdmin() {
    localStorage.removeItem("admin-token");
    navegar("/admin/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white px-6 py-8 md:py-10">
      <FundoFestival variante="admin" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-6">
          <HeaderSite />
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-primary text-orange-500">Inscrições</h1>
            <p className="mt-2 text-sm text-gray-400">
              Acompanhe status, valores e detalhes de cada inscrição.
            </p>
          </div>

          <button
            onClick={sairDoAdmin}
            className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-100 hover:bg-red-500/20 transition"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {carregandoLista ? (
          <p className="text-gray-400">Carregando...</p>
        ) : (
          <>
            <div className="mb-8 text-sm text-gray-400">Total: {inscricoes.length}</div>

            <div className="grid xl:grid-cols-2 gap-4">
              {inscricoes.map((inscricao) => (
                <button
                  key={inscricao.id}
                  onClick={() => abrirDetalhes(inscricao.id)}
                  className="text-left hover:bg-zinc-800 transition p-5 rounded-xl bg-zinc-900 flex justify-between items-center"
                >
                  <div>
                    {inscricao.tipoInscricao === "ESCOLA" ? (
                      <span className="px-2 py-1 rounded text-xs bg-orange-500 text-black font-semibold">
                        ESCOLA
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs border border-orange-500 text-orange-400 bg-black font-semibold">
                        BAILARINO INDEPENDENTE
                      </span>
                    )}

                    <h2 className="font-secondary text-lg mt-3">{inscricao.nome}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {inscricao.coreografiasCadastradas} coreografias
                    </p>
                  </div>

                  <p className="text-orange-500 font-bold text-lg">R$ {inscricao.valorTotal}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {idSelecionado && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={fecharDetalhes} />

          <div className="relative bg-zinc-950 rounded-t-2xl p-6 h-[92vh] overflow-y-auto shadow-2xl animate-slideUp">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-primary text-orange-500">{tituloDetalhes}</h2>

                <button
                  onClick={fecharDetalhes}
                  className="px-4 py-2 text-sm rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
                >
                  Fechar
                </button>
              </div>

              {!detalheInscricao ? (
                <p className="text-gray-400">Carregando...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-400 mb-6">Total: R$ {detalheInscricao.valores.total}</p>

                  {detalheInscricao.escola ? (
                    <div className="mb-6 space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Diretor:</span> {detalheInscricao.escola.nomeDiretor}
                      </p>
                      <p>
                        <span className="text-gray-500">WhatsApp:</span> {detalheInscricao.escola.whatsapp}
                      </p>
                      <p>
                        <span className="text-gray-500">Endereço:</span> {detalheInscricao.escola.endereco}
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6 space-y-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Responsável:</span>{" "}
                        {detalheInscricao.independente.nomeResponsavel}
                      </p>
                      <p>
                        <span className="text-gray-500">WhatsApp:</span> {detalheInscricao.independente.whatsapp}
                      </p>
                      <p>
                        <span className="text-gray-500">E-mail:</span> {detalheInscricao.independente.email}
                      </p>
                    </div>
                  )}

                  {!coreografiaSelecionada ? (
                    <>
                      <h3 className="font-secondary mb-4">Coreografias</h3>

                      <div className="grid md:grid-cols-2 gap-4">
                        {detalheInscricao.detalhamento.coreografias.map((coreografia: any) => (
                          <button
                            key={coreografia.id}
                            onClick={() => setCoreografiaSelecionada(coreografia)}
                            className="text-left p-4 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition"
                          >
                            <p className="font-medium text-lg">{coreografia.nome}</p>
                            <p className="text-sm text-gray-400">
                              {coreografia.formacao} • {coreografia.bailarinos} bailarinos
                            </p>
                            <p className="text-orange-500 font-semibold mt-2">R$ {coreografia.valor}</p>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setCoreografiaSelecionada(null)}
                        className="mb-6 text-sm text-orange-400 hover:underline"
                      >
                        ← Voltar para coreografias
                      </button>

                      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-primary text-orange-500">{coreografiaSelecionada.nome}</h3>

                          <div className="text-sm text-gray-300 space-y-2">
                            <p>
                              <span className="text-gray-500">Formação:</span> {coreografiaSelecionada.formacao}
                            </p>
                            <p>
                              <span className="text-gray-500">Modalidade:</span> {coreografiaSelecionada.modalidade}
                            </p>
                            <p>
                              <span className="text-gray-500">Categoria:</span> {coreografiaSelecionada.categoria}
                            </p>
                            <p>
                              <span className="text-gray-500">Duração:</span> {coreografiaSelecionada.duracao}
                            </p>
                            <p>
                              <span className="text-gray-500">Música:</span> {coreografiaSelecionada.musica}
                            </p>
                            <p>
                              <span className="text-gray-500">Tem cenário:</span>{" "}
                              {coreografiaSelecionada.temCenario ? "Sim" : "Não"}
                            </p>
                          </div>

                          <div className="mt-4">
                            <h4 className="font-secondary mb-3">Bailarinos</h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {coreografiaSelecionada.listaBailarinos?.map((bailarino: any) => (
                                <div key={bailarino.id} className="bg-zinc-900 p-3 rounded border border-zinc-800">
                                  {bailarino.nomeArtistico || bailarino.nomeCompleto}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 h-fit">
                          <p className="text-xs text-gray-400">Valor da coreografia</p>
                          <p className="text-orange-500 font-bold text-3xl mt-2">R$ {coreografiaSelecionada.valor}</p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
