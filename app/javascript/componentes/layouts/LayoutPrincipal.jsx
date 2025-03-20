import React from "react";
import { AppBar, Toolbar, Typography, CssBaseline, Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const LayoutPrincipal = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Barra superior */}
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Sistema de TV por Assinatura
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menu lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <List>
          {[
            { text: "Clientes", path: "/clientes" },
            { text: "Planos", path: "/planos" },
            { text: "Serviços Adicionais", path: "/servicos" },
            { text: "Pacotes", path: "/pacotes" },
            { text: "Assinaturas", path: "/assinaturas" },
            { text: "Faturamento", path: "/faturamento" },
          ].map((item, index) => (
            <ListItem button key={index} component={Link} to={item.path}>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Conteúdo principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default LayoutPrincipal;
