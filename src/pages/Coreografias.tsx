import { useParams, useNavigate } from "react-router-dom";
import CoreografiaForm from "../components/forms/CoreografiaForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function Coreografias() {
  const { escolaId } = useParams();
  const navegar = useNavigate();

  if (!escolaId) return null;

  return (
    <PaginaComVoltar
      titulo="Cadastro de Coreografias"
      subtitulo="Preencha os dados técnicos da coreografia e selecione os bailarinos participantes."
      aoVoltar={() => navegar(-1)}
      classeContainer="max-w-6xl"
      etapas={[
        { id: "tipo", titulo: "Tipo" },
        { id: "dados", titulo: "Dados" },
        { id: "elenco", titulo: "Elenco" },
        { id: "coreografias", titulo: "Coreografias" },
        { id: "resumo", titulo: "Resumo" },
      ]}
      etapaAtualId="coreografias"
    >
      <CoreografiaForm inscricaoId={escolaId} tipoInscricao="escola" />
    </PaginaComVoltar>
  );
}
