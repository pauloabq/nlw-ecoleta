// React: defaut export do módulo; useState: é uma função que foi exportada, e precisa ser importada indicada entre chaves (pois não é a padrão). 
import React from 'react';
import './App.css';

import Routes from './routes'

function App() {
  return (
    <Routes />
  );
}

export default App;
