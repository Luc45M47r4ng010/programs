import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const PagiPlanos = () => {
  const [planos, setPlanos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newPlano, setNewPlano] = useState({ nome: '', descricao: '', valor: 0 });
  const [editingPlano, setEditingPlano] = useState(null);
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // Carregar planos ao montar a página
  useEffect(() => {
    axios.get('http://localhost:5000/planos') // Substitua pela sua URL de API
      .then(response => setPlanos(response.data))
      .catch(error => console.error("Erro ao carregar planos:", error));
  }, []);

  // Função para abrir o formulário de adicionar plano
  const handleOpenDialog = (plano = null) => {
    if (plano) {
      setEditingPlano(plano);
      setNewPlano(plano); // Preenche o formulário de edição
    } else {
      setEditingPlano(null);
      setNewPlano({ nome: '', descricao: '', valor: 0 });
    }
    setOpenDialog(true);
  };

  // Função para fechar o diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPlano(null);
  };

  // Função para salvar o novo plano
  const handleSavePlano = () => {
    if (!newPlano.nome.trim()) {
      alert("O nome do plano é obrigatório.");
      return;
    }
  
    if (!newPlano.valor || newPlano.valor <= 0) {
      alert("O valor do plano deve ser maior que zero.");
      return;
    }
  
    if (editingPlano) {
      axios.put(`http://localhost:5000/planos/${editingPlano.id}`, newPlano)
        .then(response => {
          const updatedPlanos = planos.map(plano => plano.id === editingPlano.id ? response.data : plano);
          setPlanos(updatedPlanos);
          handleCloseDialog();
        })
        .catch(error => {
          console.error("Erro ao editar plano:", error.response?.data.errors || error);
          alert(error.response?.data.errors.join("\n"));
        });
    } else {
      axios.post('http://localhost:5000/planos', newPlano)
        .then(response => {
          setPlanos([...planos, response.data]);
          handleCloseDialog();
        })
        .catch(error => {
          console.error("Erro ao adicionar plano:", error.response?.data.errors || error);
          alert(error.response?.data.errors.join("\n"));
        });
    }
  };
  

  
  const handleDeletePlano = (id) => {
    axios
      .delete(`http://localhost:5000/planos/${id}`, {
        headers: {
          'X-CSRF-Token': csrfToken
        }
      })
      .then((response) => {
        console.log('Plano excluído:', response.data);
        // Atualize o estado ou faça algo após excluir o plano
      })
      .catch((error) => {
        console.error('Erro ao excluir plano:', error);
      });
  };
  

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Adicionar Plano
      </Button>

      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planos.map(plano => (
              <TableRow key={plano.id}>
                <TableCell>{plano.nome}</TableCell>
                <TableCell>{plano.descricao}</TableCell>
                <TableCell>R${plano.valor}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(plano)} color="primary">Editar</Button>
                  <Button onClick={() => handleDeletePlano(plano.id)} color="secondary">Excluir</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para adicionar/editar plano */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingPlano ? 'Editar Plano' : 'Adicionar Novo Plano'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            value={newPlano.nome}
            onChange={(e) => setNewPlano({ ...newPlano, nome: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Descrição"
            fullWidth
            value={newPlano.descricao}
            onChange={(e) => setNewPlano({ ...newPlano, descricao: e.target.value })}
            margin="normal"
          />
          <TextField
            label="Preço"
            fullWidth
            type="number"
            value={newPlano.valor}
            onChange={(e) => setNewPlano({ ...newPlano, valor: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
          <Button onClick={handleSavePlano} color="primary">{editingPlano ? 'Salvar' : 'Adicionar'}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PagiPlanos;
