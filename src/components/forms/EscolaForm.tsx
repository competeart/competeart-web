import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { criarEscola } from "../../lib/api";

type Profissional = {
  nome: string;
  funcao: "COREOGRAFO" | "ASSISTENTE";
  ehExtra: boolean;
};

type DadosEscola = {
  nome: string;
  endereco: string;
  email: string;
  whatsapp: string;
  nomeDiretor: string;
  limiteCoreografias: number;
  profissionais: Profissional[];
};

export default function EscolaForm() {
  const navegar = useNavigate();

  const [dadosFormulario, setDadosFormulario] = useState<DadosEscola>({
    nome: "",
    endereco: "",
    email: "",
    whatsapp: "",
    nomeDiretor: "",
    limiteCoreografias: 0,
    profissionais: [],
  });
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [errosCampo, setErrosCampo] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);

  function formatarTelefone(valor: string) {
    const numeros = valor.replace(/\D/g, "").slice(0, 11);

    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;

    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  }

  function alterarCampo(evento: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evento.target;

    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: name === "limiteCoreografias" ? Number(value) : value,
    }));
  }

  function recalcularProfissionaisExtras(profissionais: Profissional[]) {
    return profissionais.map((profissional, indice) => ({
      ...profissional,
      ehExtra: indice >= 2,
    }));
  }

  function adicionarProfissional() {
    setErrosCampo((errosAtuais) => {
      const { profissionais, ...restante } = errosAtuais;
      return restante;
    });

    const novoProfissional: Profissional = {
      nome: "",
      funcao: "ASSISTENTE",
      ehExtra: false,
    };

    setDadosFormulario((dadosAtuais) => ({
      ...dadosAtuais,
      profissionais: recalcularProfissionaisExtras([
        ...dadosAtuais.profissionais,
        novoProfissional,
      ]),
    }));
  }

  function atualizarProfissional(
    indice: number,
    campo: keyof Profissional,
    valor: string,
  ) {
    setDadosFormulario((dadosAtuais) => {
      const profissionais = [...dadosAtuais.profissionais];
      profissionais[indice] = { ...profissionais[indice], [campo]: valor };

      return {
        ...dadosAtuais,
        profissionais: recalcularProfissionaisExtras(profissionais),
      };
    });
  }

  async function enviarFormulario(evento: React.FormEvent) {
    if (enviando) return;

    evento.preventDefault();
    setErroGeral(null);
    setErrosCampo({});

    const novosErros: Record<string, string> = {};

    if (!dadosFormulario.nome.trim()) novosErros.nome = "Informe o nome da escola.";
    if (!dadosFormulario.endereco.trim()) novosErros.endereco = "Informe o endereço da escola.";
    if (!dadosFormulario.email.trim()) novosErros.email = "Informe o e-mail da escola.";
    if (!dadosFormulario.whatsapp.trim()) {
      novosErros.whatsapp = "Informe o número de WhatsApp da escola.";
    }
    if (!dadosFormulario.nomeDiretor.trim()) {
      novosErros.nomeDiretor = "Informe o nome do diretor da escola.";
    }
    if (dadosFormulario.limiteCoreografias < 1) {
      novosErros.limiteCoreografias = "Informe pelo menos 1 coreografia.";
    }

    if (dadosFormulario.profissionais.length === 0) {
      novosErros.profissionais = "Adicione pelo menos um profissional responsável.";
    }

    const semNome = dadosFormulario.profissionais.some((p) => !p.nome.trim());
    if (semNome) {
      novosErros.profissionais = "Preencha o nome de todos os profissionais.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErrosCampo(novosErros);
      return;
    }

    try {
      setEnviando(true);
      const resposta = await criarEscola(dadosFormulario);
      navegar(`/inscricao/${resposta.id}/elenco`);
    } catch (erro: any) {
      if (erro?.field) {
        setErrosCampo({ [erro.field]: erro.message });
        return;
      }

      setErroGeral(erro?.message || "Erro ao criar escola. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviarFormulario} className="max-w-6xl mx-auto">
      {erroGeral && (
        <div className="mb-4 p-3 rounded-md bg-red-500/10 text-red-400 text-sm">{erroGeral}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input
            name="nome"
            type="text"
            placeholder="Nome da escola"
            value={dadosFormulario.nome}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.nome && <p className="text-sm text-red-400 mt-1">{errosCampo.nome}</p>}
        </div>

        <div>
          <input
            name="email"
            type="email"
            placeholder="E-mail da escola"
            value={dadosFormulario.email}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.email && <p className="text-sm text-red-400 mt-1">{errosCampo.email}</p>}
        </div>

        <div>
          <input
            name="whatsapp"
            type="tel"
            placeholder="WhatsApp"
            value={dadosFormulario.whatsapp}
            onChange={(evento) =>
              setDadosFormulario((dadosAtuais) => ({
                ...dadosAtuais,
                whatsapp: formatarTelefone(evento.target.value),
              }))
            }
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.whatsapp && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.whatsapp}</p>
          )}
        </div>

        <div>
          <input
            name="nomeDiretor"
            type="text"
            placeholder="Nome do(a) diretor(a)"
            value={dadosFormulario.nomeDiretor}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.nomeDiretor && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.nomeDiretor}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <input
            name="endereco"
            type="text"
            placeholder="Endereço completo"
            value={dadosFormulario.endereco}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.endereco && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.endereco}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-400 block mb-1">Quantidade de coreografias</label>
          <input
            name="limiteCoreografias"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Quantidade de coreografias"
            value={dadosFormulario.limiteCoreografias}
            onChange={alterarCampo}
            className="w-full px-4 py-3 rounded-md bg-zinc-900 text-white placeholder-gray-400 focus:outline-none"
          />
          {errosCampo.limiteCoreografias && (
            <p className="text-sm text-red-400 mt-1">{errosCampo.limiteCoreografias}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-secondary font-semibold mb-3">Profissionais</h3>
        {errosCampo.profissionais && (
          <p className="text-sm text-red-400 mb-3">{errosCampo.profissionais}</p>
        )}

        <div className="grid lg:grid-cols-2 gap-3">
          {dadosFormulario.profissionais.map((profissional, indice) => (
            <div key={indice} className="flex flex-col gap-2 p-4 rounded-md bg-zinc-900">
              <input
                type="text"
                placeholder="Nome do profissional"
                value={profissional.nome}
                onChange={(evento) =>
                  atualizarProfissional(indice, "nome", evento.target.value)
                }
                className="px-3 py-2 rounded bg-zinc-800 text-white focus:outline-none"
              />

              <select
                value={profissional.funcao}
                onChange={(evento) =>
                  atualizarProfissional(indice, "funcao", evento.target.value)
                }
                className="px-3 py-2 rounded bg-zinc-800 text-white focus:outline-none"
              >
                <option value="COREOGRAFO">Coreógrafo(a)</option>
                <option value="ASSISTENTE">Assistente</option>
              </select>

              {profissional.ehExtra && (
                <p className="text-sm text-orange-400">Profissional extra (R$ 70)</p>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={adicionarProfissional}
          className="mt-3 text-orange-400 text-sm hover:underline"
        >
          + Adicionar profissional
        </button>
      </div>

      <button
        type="submit"
        disabled={enviando}
        className="mt-8 px-6 py-3 bg-orange-500 text-black font-medium transition-colors hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {enviando ? "Avançando..." : "Avançar"}
      </button>
    </form>
  );
}
