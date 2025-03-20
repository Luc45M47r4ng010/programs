import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, MenuItem, Typography, Paper, Grid, FormControl, InputLabel, Button } from '@mui/material';

const PlanPackageSelector = ({ clientId, setPlan, setPackage, setAvailableServices }) => {
  const [plans, setPlans] = useState([]);
  const [packages, setPackages] = useState([]);
  const [packageDetails, setPackageDetails] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [showPlans, setShowPlans] = useState(true);
  const [showPackages, setShowPackages] = useState(true);

  useEffect(() => {
    if (clientId) {
      axios.get('http://localhost:5000/planos').then(response => setPlans(response.data));
      axios.get('http://localhost:5000/pacotes').then(response => setPackages(response.data));
      axios.get('http://localhost:5000/servicos').then(response => {
        setAllServices(response.data);
        setAvailableServices(response.data);
      });
    }
  }, [clientId]);

  const loadPackageDetails = async (packageId) => {
    if (packageId) {
      try {
        const response = await axios.get(`http://localhost:5000/pacotes/${packageId}`);
        setPackageDetails(response.data);

        const excludedServiceIds = response.data.servicos_adicionais.map(service => service.id);
        const filteredServices = allServices.filter(service => !excludedServiceIds.includes(service.id));
        setAvailableServices(filteredServices);
      } catch (error) {
        console.error("Error loading package details:", error);
      }
    } else {
      setAvailableServices(allServices);
    }
  };

  const handlePlanChange = (e) => {
    const planId = e.target.value;
    setPlan(planId);
    setPackage(null);
    setShowPackages(false);
    setShowPlans(true);
  };

  const handlePackageChange = (e) => {
    const packageId = e.target.value;
    setPackage(packageId);
    setPlan(null);
    setShowPlans(false);
    setShowPackages(true);
    loadPackageDetails(packageId);
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h5" gutterBottom style={{ color: '#3f51b5', fontWeight: 'bold' }}>
        Selecione o Pacote ou Plano
      </Typography>

      <Grid container spacing={3}>
        {/* Campo de Planos */}
        {showPlans && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Planos</InputLabel>
              <Select onChange={handlePlanChange} style={{ backgroundColor: '#fff' }}>
                <MenuItem value="">Selecione o Plano</MenuItem>
                {plans.map(plan => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.nome} - R${plan.valor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Campo de Pacotes */}
        {showPackages && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Pacotes</InputLabel>
              <Select onChange={handlePackageChange} style={{ backgroundColor: '#fff' }}>
                <MenuItem value="">Selecione o Pacote</MenuItem>
                {packages.map(pkg => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    {pkg.nome} - R${pkg.valor}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      {/* Exibição dos detalhes do pacote selecionado */}
      {packageDetails && (
        <Paper elevation={2} style={{ padding: '15px', marginTop: '20px', backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" style={{ color: '#1976d2', fontWeight: 'bold' }}>
            Detalhes do Pacote
          </Typography>
          <Typography><strong>Nome:</strong> {packageDetails.nome}</Typography>
          <Typography><strong>Preço:</strong> R${packageDetails.valor}</Typography>

          <Typography variant="subtitle1" style={{ marginTop: '10px', color: '#1976d2' }}>
            Serviços Adicionais Inclusos
          </Typography>
          <ul>
            {packageDetails.servicos_adicionais && packageDetails.servicos_adicionais.length > 0 ? (
              packageDetails.servicos_adicionais.map(service => (
                <li key={service.id}>{service.nome} - R${service.valor}</li>
              ))
            ) : (
              <Typography>Não há serviços adicionais neste pacote.</Typography>
            )}
          </ul>
        </Paper>
      )}
    </Paper>
  );
};

export default PlanPackageSelector;