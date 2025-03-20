import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ClientSelector = ({ setClient }) => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/clientes')
      .then(response => setClients(response.data))
      .catch(error => {
        console.error("Erro ao buscar clientes:", error);
      });
  }, []);

  return (
    <FormControl fullWidth style={{ marginBottom: '20px' }}>
      <InputLabel>Selecione o Cliente</InputLabel>
      <Select onChange={e => setClient(e.target.value)} style={{ backgroundColor: '#fff' }}>
        <MenuItem value="">Selecione o Cliente</MenuItem>
        {clients.map(client => (
          <MenuItem key={client.id} value={client.id}>
            {client.nome}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default ClientSelector;