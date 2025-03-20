import React, { useState } from 'react';
import { Checkbox, List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

const AdditionalServicesSelector = ({ availableServices, setSelectedServices }) => {
  const [selectedServices, setSelectedServicesState] = useState([]);

  const handleServiceSelection = (serviceId) => {
    const alreadySelected = selectedServices.includes(serviceId);
    if (!alreadySelected) {
      setSelectedServicesState([...selectedServices, serviceId]);
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  return (
    <Paper elevation={2} style={{ padding: '15px', marginTop: '20px', backgroundColor: '#e3f2fd' }}>
      <Typography variant="h6" style={{ color: '#1976d2', fontWeight: 'bold' }}>
        Selecione os Serviços Adicionais
      </Typography>
      <List>
        {availableServices.map(service => (
          <ListItem key={service.id}>
            <Checkbox
              checked={selectedServices.includes(service.id)}
              onChange={() => handleServiceSelection(service.id)}
              color="primary"
            />
            <ListItemText primary={`${service.nome} - R$${service.valor}`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default AdditionalServicesSelector;