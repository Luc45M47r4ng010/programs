import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const ClientesForm = ({ onSubmit }) => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nome, idade });
    setNome('');
    setIdade('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Idade"
            variant="outlined"
            type="number"
            fullWidth
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Cadastrar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

const ClientesTable = ({ clientes }) => {
  if (clientes.length === 0) {
    return <Typography variant="body1" sx={{ marginTop: 2 }}>Nenhum cliente cadastrado.</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>Nome</strong></TableCell>
            <TableCell><strong>Idade</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>{cliente.nome}</TableCell>
              <TableCell>{cliente.idade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/clientes');
      if (!response.ok) throw new Error('Erro ao buscar clientes');
      const data = await response.json();
      setClientes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleSubmit = async (clienteData) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    try {
      const response = await fetch('http://localhost:5000/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(clienteData),
      });
      if (!response.ok) throw new Error('Erro ao cadastrar cliente');
      fetchClientes();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Typography variant="body1">Carregando...</Typography>;
  if (error) return <Typography variant="body1" color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', paddingTop: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cadastro de Cliente
      </Typography>
      <ClientesForm onSubmit={handleSubmit} />
      <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
        Clientes Cadastrados
      </Typography>
      <ClientesTable clientes={clientes} />
    </Box>
  );
}

export default Clientes;