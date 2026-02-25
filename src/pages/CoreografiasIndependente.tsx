import { useParams, useNavigate } from "react-router-dom";
import CoreografiaForm from "../components/forms/CoreografiaForm";
import PaginaComVoltar from "../components/layout/PaginaComVoltar";

export default function CoreografiasIndependente() {
  const { independenteId } = useParams();
  const navegar = useNavigate();

  if (!independenteId) return null;

  return (
    <PaginaComVoltar
      titulo="Cadastro de Coreografias"
      subtitulo="Preencha os dados técnicos da coreografia e selecione os participantes do elenco."
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
      <CoreografiaForm inscricaoId={independenteId} tipoInscricao="independente" />
    </PaginaComVoltar>
  );
}
