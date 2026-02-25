import { useNavigate } from "react-router-dom";
import EscolaForm from "../components/forms/EscolaForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function InscricaoEscola() {
  const navegar = useNavigate();

  return (
    <PaginaComVoltar
      titulo="Cadastro da Escola"
      subtitulo="Preencha os dados principais da escola e os profissionais responsáveis antes de montar o elenco."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "dados", titulo: "Dados" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Resumo" },
      ]}
      etapaAtualId="dados"
    >
      <EscolaForm />
    </PaginaComVoltar>
  );
}
