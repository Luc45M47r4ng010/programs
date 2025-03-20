import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutPrincipal from "./layouts/LayoutPrincipal";
import Clientes from "./Clientes/CadastroCliente";
import PagiPlanos from "./Planos/PagiPlanos";
import ServicosAdicionais from "./ServicosAdicionais/ServicosAdicionais";
import CadastroPacote from "./pacotes/CadastroPacotes";
import SubscriptionForm from "./assinaturasComp/inscreverAssinatura";
import FaturamentoCli from "./Faturamento/FaturamentoCli";

// Páginas (por enquanto placeholders)
<h2>Cadastro de Clientes</h2>;
<h2>Cadastro de Planos</h2>;
<h2>Cadastro de Serviços Adicionais</h2>;
<h2>Cadastro de Pacotes</h2>;
<h2>Realização deAssinaturas</h2>;
<h2>Faturamento</h2>;

const App = () => {
  return (
    <Router>
      <LayoutPrincipal>
        <Routes>
          <Route path="/" element={<Clientes />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/planos" element={<PagiPlanos />} />
          <Route path="/planos/:id" element={<PagiPlanos />} />
          <Route path="/servicos" element={<ServicosAdicionais />} />
          <Route path="/servicos/:id" element={<ServicosAdicionais />} />
          <Route path="/pacotes" element={<CadastroPacote />} />
          <Route path="/pacotes/:id" element={<CadastroPacote />} />
          <Route path="/assinaturas" element={<SubscriptionForm />} />
          <Route path="/faturamento" element={<FaturamentoCli />} />
          <Route path="/faturamento/:id" element={<FaturamentoCli />} />
        </Routes>
      </LayoutPrincipal>
    </Router>
  );
};

export default App;
