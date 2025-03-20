import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, Box, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const FaturamentoCli = () => {
  const [clientes, setClientes] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [faturamentoMensal, setFaturamentoMensal] = useState([]); // Faturamento mensal
  const [totalAnual, setTotalAnual] = useState(0); // Total dos 12 meses

  // Função para buscar clientes (para popular a lista de clientes)
  const buscarClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes'); // Modifique a URL conforme necessário
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  // Função para buscar as assinaturas por cliente
  const buscarAssinaturasPorCliente = async (clienteId) => {
    try {
      const response = await axios.get(`http://localhost:5000/assinaturas?cliente_id=${clienteId}`);
      setAssinaturas(response.data);
      calcularFaturamentoMensal(response.data); // Calcula o faturamento mensal
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error);
    }
  };

  // Função para calcular o valor total da assinatura (plano + pacote + serviços adicionais)
  const calcularValorTotal = (assinatura) => {
    const valorPlano = assinatura.plano ? parseFloat(assinatura.plano.valor) : 0; // Valor do plano (se existir diretamente na assinatura)
    const valorPacote = assinatura.pacote ? parseFloat(assinatura.pacote.valor) : 0; // Valor do pacote
    const valorPlanoDoPacote = assinatura.pacote?.plano ? parseFloat(assinatura.pacote.plano.valor) : 0; // Valor do plano dentro do pacote
    const valorServicos = assinatura.servicos_adicionais?.reduce((total, servico) => total + parseFloat(servico.valor), 0) || 0; // Valor dos serviços adicionais

    return valorPlano + valorPacote + valorPlanoDoPacote + valorServicos; // Soma total
  };

  // Função para calcular o faturamento mensal e o total anual
  const calcularFaturamentoMensal = (assinaturas) => {
    const meses = Array(12).fill(0); // Inicializa um array com 12 meses (valores zerados)
    const vencimentos = Array(12).fill(null); // Inicializa um array com as datas de vencimento

    assinaturas.forEach((assinatura) => {
      const dataAssinatura = new Date(assinatura.created_at);
      const mesInicio = dataAssinatura.getMonth() + 1; // Mês de início (próximo mês)
      const valorMensal = calcularValorTotal(assinatura); // Valor mensal da assinatura

      // Distribui o valor mensal a partir do próximo mês, garantindo 12 meses
      for (let i = 0; i < 12; i++) {
        const mes = (mesInicio + i) % 12; // Calcula o mês corretamente (considerando o ciclo de 12 meses)
        meses[mes] += valorMensal;

        // Define a data de vencimento (dia 10 do próximo mês)
        const ano = dataAssinatura.getFullYear() + Math.floor((mesInicio + i) / 12); // Ajusta o ano se necessário
        vencimentos[mes] = new Date(ano, mes, 10); // Dia 10 do mês
      }
    });

    setFaturamentoMensal(meses.map((valor, index) => ({
      valor,
      vencimento: vencimentos[index], // Data de vencimento
    }))); // Atualiza o faturamento mensal com valores e datas de vencimento
    setTotalAnual(meses.reduce((total, valor) => total + valor, 0)); // Calcula o total anual
  };

  // Função para calcular a data de vencimento (dia 10 do próximo mês)
  const calcularDataVencimento = (dataAssinatura) => {
    const proximoMes = new Date(dataAssinatura);
    proximoMes.setMonth(proximoMes.getMonth() + 1); // Próximo mês
    proximoMes.setDate(10); // Dia 10 do próximo mês
    return proximoMes;
  };

  // Função para tratar a seleção de um cliente
  const handleClienteSelect = (clienteId) => {
    setClienteSelecionado(clienteId);
    buscarAssinaturasPorCliente(clienteId);
  };

  // Carregar clientes ao inicializar o componente
  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5">Faturamento</Typography>

      {/* Lista de Clientes */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6">Selecione o Cliente</Typography>
        </Grid>
        {clientes.map((cliente) => (
          <Grid item xs={12} sm={6} md={4} key={cliente.id}>
            <Button
              variant="contained"
              onClick={() => handleClienteSelect(cliente.id)}
              fullWidth
            >
              {cliente.nome}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Exibição das Assinaturas do Cliente Selecionado */}
      {clienteSelecionado && assinaturas.length > 0 && (
        <Box sx={{ marginTop: 3 }}>
          <Typography variant="h6">Assinaturas de {clientes.find(c => c.id === clienteSelecionado)?.nome}</Typography>

          {assinaturas.map((assinatura) => {
            // Verifica se o pacote ou o plano existe e define o nome
            const nomeAssinatura = assinatura.plano_id 
              ? assinatura.plano?.nome 
              : assinatura.pacote_id 
              ? assinatura.pacote?.nome 
              : 'Sem plano/pacote';

            // Calcula a data de vencimento (dia 10 do próximo mês)
            const dataAssinatura = new Date(assinatura.created_at);
            const dataVencimento = calcularDataVencimento(dataAssinatura);

            return (
              <Box key={assinatura.id} sx={{ marginBottom: 3 }}>
                <Card>
                  <CardContent>
                    <Typography>
                      <strong>Nome da Assinatura:</strong> {nomeAssinatura}
                    </Typography>

                    {/* Exibição da data de assinatura */}
                    <Typography>
                      <strong>Data de Assinatura:</strong> {dataAssinatura.toLocaleDateString('pt-BR')}
                    </Typography>

                    {/* Exibição da data de vencimento */}
                    <Typography>
                      <strong>Data de Vencimento:</strong> {dataVencimento.toLocaleDateString('pt-BR')}
                    </Typography>

                    {/* Exibição do pacote */}
                    {assinatura.pacote_id && (
                      <Typography>
                        <strong>Pacote:</strong> {assinatura.pacote?.nome} (R${assinatura.pacote?.valor})
                      </Typography>
                    )}

                    {/* Exibição do plano */}
                    {assinatura.plano_id && (
                      <Typography>
                        <strong>Plano:</strong> {assinatura.plano?.nome} (R${assinatura.plano?.valor})
                      </Typography>
                    )}

                    {/* Exibição do plano dentro do pacote */}
                    {assinatura.pacote?.plano && (
                      <Typography>
                        <strong>Plano do Pacote:</strong> {assinatura.pacote.plano.nome} (R${assinatura.pacote.plano.valor})
                      </Typography>
                    )}

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

                    {/* Exibição do valor total da assinatura */}
                    <Typography variant="h6" sx={{ marginTop: 2 }}>
                      <strong>Valor Total:</strong> R$
                      {calcularValorTotal(assinatura).toFixed(2)}
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
        <Typography variant="body1">Nenhuma assinatura encontrada para este cliente.</Typography>
      )}

      {/* Nova Aba: Faturamento Mensal e Total Anual */}
      {clienteSelecionado && (
        <Box sx={{ marginTop: 5 }}>
          <Typography variant="h5">Faturamento Mensal e Total Anual</Typography>

          {/* Tabela de Faturamento Mensal */}
          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mês</TableCell>
                  <TableCell align="right">Data de Vencimento</TableCell>
                  <TableCell align="right">Valor (R$)</TableCell>
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

          {/* Total Anual */}
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            <strong>Total Anual:</strong> R${totalAnual.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FaturamentoCli;