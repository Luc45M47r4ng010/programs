import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './componentes/App';
import axios from 'axios';

// Configurar o axios para incluir o token CSRF automaticamente
axios.defaults.headers['X-CSRF-Token'] = document.querySelector('[name="csrf-token"]').content;


document.addEventListener('DOMContentLoaded', () =>{
    const rootElement = document.getElementById('root');
    if(rootElement){
        const root = ReactDOM.createRoot(rootElement);
        root.render(<App/>);
    }
});
