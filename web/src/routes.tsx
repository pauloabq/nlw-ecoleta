import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom'

// este arquivo passa a ser o gerenciador das rotas. então, nele devemos importar os módulos que são as páginas da aplicação
// enquanto isso, App.tsx agora importa apenas este arquivo.
import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'

const Routes = () => {
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/create-point" />
        </BrowserRouter>
    )
}

export default Routes;