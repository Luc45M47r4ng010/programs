import React, { useState, useEffect, Component } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

// Error Boundary para capturar erros na renderização
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Erro capturado:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Ocorreu um erro no componente. Tente novamente mais tarde.</h1>;
    }
    return this.props.children;
  }
}

const ServicosAdicionais = () => {
  const [servicos, setServicos] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newServico, setNewServico] = useState({ nome: '', valor: 0 });
  const [editingServico, setEditingServico] = useState(null);
  const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

  // Carregar serviços adicionais
  useEffect(() => {
    axios.get('http://localhost:5000/servicos')
      .then(response => {
        console.log('Serviços carregados:', response.data);  // Adicionando log aqui
        setServicos(response.data);
      })
      .catch(error => {
        console.error("Erro ao carregar serviços adicionais:", error);
      });
  }, []);

  const handleOpenDialog = (servicos = null) => {
    console.log('Abrindo o dialog para editar/adicionar serviço', servicos);  // Logando os dados do serviço
    if (servicos) {
      setEditingServico(servicos);
      setNewServico(servicos);
    } else {
      setEditingServico(null);
      setNewServico({ nome: '', valor: 0 });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingServico(null);
  };

  const handleSaveServico = () => {
    console.log('Salvando serviço:', newServico); 
    if (!newServico.nome.trim() || !newServico.valor) {
      alert("Nome e Valor são obrigatórios!");
      return;
    }
  
    if (editingServico) {
      console.log('Editando serviço:', editingServico.id);
      axios.put(`http://localhost:5000/servicos/${editingServico.id}`, newServico)
        .then(response => {
          console.log('Serviço editado com sucesso:', response.data); 
          if (response.data) {
            const updatedServicos = servicos.map(servico => servico.id === editingServico.id ? response.data : servico);
            setServicos(updatedServicos);
            handleCloseDialog();
          } else {
            console.error("Erro ao editar serviço: resposta inesperada", response);
          }
        })
        .catch(error => {
          console.error("Erro ao editar serviço adicional:", error);
        });
    } else {
      console.log('Adicionando novo serviço');
      axios.post('http://localhost:5000/servicos', newServico)
        .then(response => {
          console.log('Novo serviço adicionado:', response.data);
          setServicos([...servicos, response.data]);
          handleCloseDialog();
        })
        .catch(error => {
          console.error("Erro ao adicionar serviço adicional:", error);
        });
    }
  };
  

  const handleDeleteServico = (id) => {
    console.log('Excluindo serviço com ID:', id);
    axios.delete(`http://localhost:5000/servicos/${id}`, { headers: { 'X-CSRF-Token': csrfToken } })
      .then(() => {
        setServicos(servicos.filter(servico => servico.id !== id));
      })
      .catch(error => console.error("Erro ao excluir serviço adicional:", error));
  };

  return (
    <ErrorBoundary>
      <div>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          Adicionar Serviço Adicional
        </Button>

        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicos.map(servico => (
                <TableRow key={servico.id}>
                  <TableCell>{servico.nome}</TableCell>
                  <TableCell>R${servico.valor}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenDialog(servico)} color="primary">Editar</Button>
                    <Button onClick={() => handleDeleteServico(servico.id)} color="secondary">Excluir</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{editingServico ? 'Editar Serviço Adicional' : 'Adicionar Serviço Adicional'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Nome"
              fullWidth
              value={newServico.nome}
              onChange={(e) => setNewServico({ ...newServico, nome: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Valor"
              fullWidth
              type="number"
              value={newServico.valor}
              onChange={(e) => setNewServico({ ...newServico, valor: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Cancelar</Button>
            <Button onClick={handleSaveServico} color="primary">{editingServico ? 'Salvar' : 'Adicionar'}</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default ServicosAdicionais;
