import React, { useState } from 'react';
import ClientSelector from './ClienteSeletor';
import PlanPackageSelector from './PlanoSeletor';
import AdditionalServicesSelector from './servicosAdicionais';
import axios from 'axios';
import { Button, Paper, Typography, Container, Grid, Card, CardContent } from '@mui/material';

const SubscriptionForm = () => {
  const [client, setClient] = useState(null);
  const [plan, setPlan] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  // Função para limpar todos os campos
  const limparCampos = () => {
    setClient(null);
    setPlan(null);
    setPkg(null);
    setSelectedServices([]);
    setAvailableServices([]);
  };

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
          limparCampos(); // Limpa os campos após o envio bem-sucedido
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
    <Container maxWidth="md" sx={{ marginTop: '40px', marginBottom: '40px' }}>
      <Paper elevation={3} sx={{ padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>
          Formulário para Realização de Assinatura
        </Typography>

        {/* Selecione o cliente */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '20px' }}>
                  Selecione o Cliente
                </Typography>
                <ClientSelector setClient={setClient} />
              </CardContent>
            </Card>
          </Grid>

          {client && (
            <>
              {/* Selecione o plano e o pacote */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '20px' }}>
                      Selecione o Plano ou Pacote
                    </Typography>
                    <PlanPackageSelector
                      clientId={client}
                      setPlan={setPlan}
                      setPackage={setPkg}
                      setAvailableServices={setAvailableServices}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Selecione os serviços adicionais */}
              {(plan || pkg) && (
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: '20px' }}>
                        Serviços Adicionais
                      </Typography>
                      <AdditionalServicesSelector
                        availableServices={availableServices}
                        setSelectedServices={setSelectedServices}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Botão de envio */}
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{
                    backgroundColor: '#3f51b5',
                    '&:hover': { backgroundColor: '#303f9f' },
                    padding: '10px 30px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                  }}
                >
                  Realizar Assinatura
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default SubscriptionForm;