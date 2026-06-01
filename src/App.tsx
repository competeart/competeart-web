import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Inscricao from "./pages/Inscricao";
import InscricaoEscola from "./pages/InscricaoEscola";
import InscricaoIndependente from "./pages/InscricaoIndependente";
import Elenco from "./pages/Elenco";
import Coreografias from "./pages/Coreografias";
import Resumo from "./pages/Resumo";
import Admin from "./pages/Admin";
import AdminCheckIn from "./pages/AdminCheckIn";
import AdminLogin from "./pages/AdminLogin";
import CheckInLogin from "./pages/CheckInLogin";
import Cronograma from "./pages/Cronograma";
import CronogramaEditar from "./pages/CronogramaEditar";
import ElencoIndependente from "./pages/ElencoIndependente";
import CoreografiasIndependente from "./pages/CoreografiasIndependente";
import ResumoIndependente from "./pages/ResumoIndependente";
import Jurados from "./pages/Jurados";
import Localizacao from "./pages/Localizacao";
import { REGULAMENTO_URL } from "./lib/regulamento";

function RedirecionamentoRegulamento() {
  useEffect(() => {
    window.location.replace(REGULAMENTO_URL);
  }, []);

  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jurados" element={<Jurados />} />
        <Route path="/localizacao" element={<Localizacao />} />
        <Route path="/coreografias" element={<Cronograma />} />
        <Route path="/coreografias/editar" element={<CronogramaEditar />} />
        <Route path="/cronograma" element={<Cronograma />} />
        <Route path="/cronograma/editar" element={<CronogramaEditar />} />
        <Route path="/regulamento" element={<RedirecionamentoRegulamento />} />
        <Route path="/inscricao" element={<Inscricao />} />
        <Route path="/inscricao/escola" element={<InscricaoEscola />} />
        <Route
          path="/inscricao/independente"
          element={<InscricaoIndependente />}
        />
        <Route path="/inscricao/:escolaId/elenco" element={<Elenco />} />
        <Route
          path="/inscricao/:escolaId/coreografias"
          element={<Coreografias />}
        />
        <Route path="/inscricao/:escolaId/resumo" element={<Resumo />} />
        <Route
          path="/independentes/:independenteId/elenco"
          element={<ElencoIndependente />}
        />
        <Route
          path="/independentes/:independenteId/coreografias"
          element={<CoreografiasIndependente />}
        />
        <Route
          path="/independentes/:independenteId/resumo"
          element={<ResumoIndependente />}
        />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/check-in" element={<Navigate to="/check-in" replace />} />
        <Route path="/check-in/login" element={<CheckInLogin />} />
        <Route path="/check-in" element={<AdminCheckIn />} />
      </Routes>
    </BrowserRouter>
  );
}
