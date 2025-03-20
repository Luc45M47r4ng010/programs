import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  Grid,
  Typography,
  Container,
  Paper
} from '@mui/material';
import axios from 'axios';

const CadastroPacote = () => {
  const [pacote, setPacote] = useState({
    nome: '',
    planoId: '',
    servicosAdicionais: [],
    valor: 0,
  });
  const [planos, setPlanos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/planos').then(response => setPlanos(response.data));
    axios.get('http://localhost:5000/servicos').then(response => setServicos(response.data));
  }, []);

  // Função para limpar todos os campos
  const limparCampos = () => {
    setPacote({
      nome: '',
      planoId: '',
      servicosAdicionais: [],
      valor: 0,
    });
    setErro('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPacote(prevState => ({
      ...prevState,
      [name]: name === 'valor' ? parseFloat(value) : value, // Converte o valor para número
    }));
  };

  const handleSelectServicos = (event) => {
    const { value } = event.target;
    setPacote(prevState => ({
      ...prevState,
      servicosAdicionais: value
    }));
  };

  const handleSubmit = () => {
    console.log("Valor do pacote antes de enviar:", pacote.valor); // Debug do valor
    const dados = {
      nome: pacote.nome,
      plano_id: pacote.planoId,
      valor: pacote.valor, // Certifique-se de que esse valor está sendo enviado
      servicos_adicionais: pacote.servicosAdicionais,
    };

    console.log("Dados enviados:", dados); // Verifique os dados no console

    axios.post('http://localhost:5000/pacotes', { pacote: dados })
      .then(response => {
        alert('Pacote cadastrado com sucesso!');
        limparCampos(); // Limpa os campos após o envio bem-sucedido
      })
      .catch(() => setErro('Erro ao cadastrar pacote.'));
  };

  // Função para exibir os nomes dos serviços selecionados
  const renderSelectedServicos = (selected) => {
    return selected
      .map(servicoId => {
        const servico = servicos.find(serv => serv.id === Number(servicoId));
        return servico ? servico.nome : '';
      })
      .join(', ');
  };

  return (
    <Container>
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom>Cadastrar Pacote</Typography>
        {erro && <Typography color="error">{erro}</Typography>}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField label="Nome" name="nome" value={pacote.nome} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Plano</InputLabel>
              <Select name="planoId" value={pacote.planoId} onChange={handleChange}>
                {planos.map(plano => (
                  <MenuItem key={plano.id} value={plano.id}>{plano.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Serviços Adicionais</InputLabel>
              <Select
                multiple
                value={pacote.servicosAdicionais}
                onChange={handleSelectServicos}
                renderValue={renderSelectedServicos} // Personaliza a exibição dos serviços selecionados
              >
                {servicos.map(servico => (
                  <MenuItem key={servico.id} value={servico.id}>
                    <Checkbox checked={pacote.servicosAdicionais.includes(servico.id)} />
                    <ListItemText primary={servico.nome} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Valor (R$)"
              name="valor"
              type="number"
              value={pacote.valor}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: "0.01" }} // Permite valores decimais com duas casas
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleSubmit} variant="contained" color="primary">Cadastrar</Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CadastroPacote;