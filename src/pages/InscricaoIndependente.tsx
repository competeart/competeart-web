import { useNavigate } from "react-router-dom";
import IndependenteForm from "../components/forms/IndependenteForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function InscricaoIndependente() {
  const navegar = useNavigate();

  return (
    <PaginaComVoltar
      titulo="Cadastro de Bailarino Independente"
      subtitulo="Informe os dados do responsável pela inscrição para seguir para o cadastro do elenco."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-4xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "dados", titulo: "Dados" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Resumo" },
      ]}
      etapaAtualId="dados"
    >
      <IndependenteForm />
    </PaginaComVoltar>
  );
}
