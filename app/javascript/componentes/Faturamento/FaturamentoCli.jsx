import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container } from '@mui/material';
import axios from 'axios';

const FaturamentoCli = () => {
  const [clientes, setClientes] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [faturamentoMensal, setFaturamentoMensal] = useState([]);
  const [totalAnual, setTotalAnual] = useState(0);

  const buscarClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  const buscarAssinaturasPorCliente = async (clienteId) => {
    try {
      const response = await axios.get(`http://localhost:5000/assinaturas?cliente_id=${clienteId}`);
      setAssinaturas(response.data);
      calcularFaturamentoMensal(response.data);
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
    }
  };

  const calcularValorTotal = (assinatura) => {
    const valorPlano = assinatura.plano ? parseFloat(assinatura.plano.valor) : 0;
    const valorPacote = assinatura.pacote ? parseFloat(assinatura.pacote.valor) : 0;
    const valorPlanoDoPacote = assinatura.pacote?.plano ? parseFloat(assinatura.pacote.plano.valor) : 0;
    const valorServicos = assinatura.servicos_adicionais?.reduce((total, servico) => total + parseFloat(servico.valor), 0) || 0;

    return valorPlano + valorPacote + valorPlanoDoPacote + valorServicos;
  };

  const calcularFaturamentoMensal = (assinaturas) => {
    const meses = Array(12).fill(0);
    const vencimentos = Array(12).fill(null);

    assinaturas.forEach((assinatura) => {
      const dataAssinatura = new Date(assinatura.created_at);
      const mesInicio = dataAssinatura.getMonth() + 1;
      const valorMensal = calcularValorTotal(assinatura);

      for (let i = 0; i < 12; i++) {
        const mes = (mesInicio + i) % 12;
        meses[mes] += valorMensal;
        const ano = dataAssinatura.getFullYear() + Math.floor((mesInicio + i) / 12);
        vencimentos[mes] = new Date(ano, mes, 10);
      }
    });

    setFaturamentoMensal(meses.map((valor, index) => ({
      valor,
      vencimento: vencimentos[index],
    })));
    setTotalAnual(meses.reduce((total, valor) => total + valor, 0));
  };

  const calcularDataVencimento = (dataAssinatura) => {
    const proximoMes = new Date(dataAssinatura);
    proximoMes.setMonth(proximoMes.getMonth() + 1);
    proximoMes.setDate(10);
    return proximoMes;
  };

  const handleClienteSelect = (clienteId) => {
    setClienteSelecionado(clienteId);
    buscarAssinaturasPorCliente(clienteId);
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 4 }}>
        Faturamento de Clientes
      </Typography>

      {/* Lista de Clientes */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ color: '#757575', marginBottom: 2 }}>
            Selecione o Cliente
          </Typography>
        </Grid>
        {clientes.map((cliente) => (
          <Grid item xs={12} sm={6} md={4} key={cliente.id}>
            <Button
              variant="contained"
              onClick={() => handleClienteSelect(cliente.id)}
              fullWidth
              sx={{
                backgroundColor: '#3f51b5',
                '&:hover': { backgroundColor: '#303f9f' },
                padding: 2,
                borderRadius: 2,
                fontWeight: 'bold',
              }}
            >
              {cliente.nome}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Exibição das Assinaturas do Cliente Selecionado */}
      {clienteSelecionado && assinaturas.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 3 }}>
            Assinaturas de {clientes.find(c => c.id === clienteSelecionado)?.nome}
          </Typography>

          {assinaturas.map((assinatura) => {
            const nomeAssinatura = assinatura.plano_id
              ? assinatura.plano?.nome
              : assinatura.pacote_id
              ? assinatura.pacote?.nome
              : 'Sem plano/pacote';

            const dataAssinatura = new Date(assinatura.created_at);
            const dataVencimento = calcularDataVencimento(dataAssinatura);

            return (
              <Box key={assinatura.id} sx={{ marginBottom: 3 }}>
                <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 2 }}>
                      {nomeAssinatura}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography>
                          <strong>Data de Assinatura:</strong> {dataAssinatura.toLocaleDateString('pt-BR')}
                        </Typography>
                        <Typography>
                          <strong>Data de Vencimento:</strong> {dataVencimento.toLocaleDateString('pt-BR')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {assinatura.pacote_id && (
                          <Typography>
                            <strong>Pacote:</strong> {assinatura.pacote?.nome} (R${assinatura.pacote?.valor})
                          </Typography>
                        )}
                        {assinatura.plano_id && (
                          <Typography>
                            <strong>Plano:</strong> {assinatura.plano?.nome} (R${assinatura.plano?.valor})
                          </Typography>
                        )}
                        {assinatura.pacote?.plano && (
                          <Typography>
                            <strong>Plano do Pacote:</strong> {assinatura.pacote.plano.nome} (R${assinatura.pacote.plano.valor})
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    <Typography variant="body2" sx={{ marginTop: 2 }}>
                      <strong>Serviços Adicionais:</strong>
                      <ul>
                        {assinatura.servicos_adicionais?.map((servico) => (
                          <li key={servico.id}>
                            {servico.nome} (R${servico.valor})
                          </li>
                        ))}
                      </ul>
                    </Typography>

                    <Typography variant="h6" sx={{ marginTop: 2, color: '#4caf50', fontWeight: 'bold' }}>
                      <strong>Valor Total:</strong> R${calcularValorTotal(assinatura).toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Caso não haja assinaturas */}
      {clienteSelecionado && assinaturas.length === 0 && (
        <Typography variant="body1" sx={{ color: '#757575', marginTop: 3 }}>
          Nenhuma assinatura encontrada para este cliente.
        </Typography>
      )}

      {/* Faturamento Mensal e Total Anual */}
      {clienteSelecionado && (
        <Box sx={{ marginTop: 6 }}>
          <Typography variant="h5" sx={{ color: '#3f51b5', fontWeight: 'bold', marginBottom: 3 }}>
            Faturamento Mensal e Total Anual
          </Typography>

          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Mês</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Data de Vencimento</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Valor (R$)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {faturamentoMensal.map((fatura, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(2023, index).toLocaleString('default', { month: 'long' })}</TableCell>
                    <TableCell align="right">
                      {fatura.vencimento ? fatura.vencimento.toLocaleDateString('pt-BR') : 'N/A'}
                    </TableCell>
                    <TableCell align="right">{fatura.valor.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" sx={{ marginTop: 3, color: '#4caf50', fontWeight: 'bold' }}>
            <strong>Total Anual:</strong> R${totalAnual.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default FaturamentoCli;