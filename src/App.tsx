import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Inscricao from "./pages/Inscricao";
import InscricaoEscola from "./pages/InscricaoEscola";
import InscricaoIndependente from "./pages/InscricaoIndependente";
import Elenco from "./pages/Elenco";
import Coreografias from "./pages/Coreografias";
import Resumo from "./pages/Resumo";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import ElencoIndependente from "./pages/ElencoIndependente";
import CoreografiasIndependente from "./pages/CoreografiasIndependente";
import ResumoIndependente from "./pages/ResumoIndependente";
import Regulamento from "./pages/Regulamento";
import Jurados from "./pages/Jurados";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jurados" element={<Jurados />} />
        <Route path="/localizacao" element={<Navigate to="/" replace />} />
        <Route path="/regulamento" element={<Regulamento />} />
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
      </Routes>
    </BrowserRouter>
  );
}
