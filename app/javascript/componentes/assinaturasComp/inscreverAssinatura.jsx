import React, { useState } from 'react';
import ClientSelector from './ClienteSeletor';
import PlanPackageSelector from './PlanoSeletor';
import AdditionalServicesSelector from './servicosAdicionais';
import axios from 'axios';
import { Button, Paper, Typography, Container } from '@mui/material';

const SubscriptionForm = () => {
  const [client, setClient] = useState(null);
  const [plan, setPlan] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  const handleSubmit = async () => {
    if (client && (plan || pkg)) {
      const data = {
        assinatura: {
          cliente_id: client,
          plano_id: plan,
          pacote_id: pkg,
          servico_adicional_ids: selectedServices,
        },
      };
  
      console.log("Dados enviados:", data); // Verifique os dados no console
  
      try {
        const response = await axios.post('http://localhost:5000/assinaturas', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 201) {
          alert('Assinatura realizada com sucesso!');
        }
      } catch (error) {
        console.error("Erro ao realizar assinatura:", error);
        if (error.response) {
          console.error("Resposta do servidor:", error.response.data);
        }
        alert("Erro ao realizar assinatura.");
      }
    } else {
      alert("Por favor selecione o cliente, o plano ou pacote para a realização da assinatura.");
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#3f51b5', fontWeight: 'bold' }}>
          Formulário para Realização de Assinatura
        </Typography>

        {/* Selecione o cliente */}
        <ClientSelector setClient={setClient} />

        {client && (
          <>
            {/* Selecione o plano e o pacote */}
            <PlanPackageSelector
              clientId={client}
              setPlan={setPlan}
              setPackage={setPkg}
              setAvailableServices={setAvailableServices}
            />

            {/* Selecione os serviços adicionais */}
            {(plan || pkg) && (
              <AdditionalServicesSelector
                availableServices={availableServices}
                setSelectedServices={setSelectedServices}
              />
            )}

            {/* Botão de envio */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: '20px', backgroundColor: '#3f51b5', fontWeight: 'bold' }}
            >
              Realizar Assinatura
            </Button>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default SubscriptionForm;