import express from 'express'
import { celebrate, Joi } from 'celebrate'


// Importando a classe criada com o PointsController.ts
import PointsController from './controllers/PointsController'
// Importando a classe criada com o ItemsController.ts
import ItemsController from './controllers/ItemsController'

import multer from 'multer'
import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig)

const pointsController = new PointsController()
const itemsController = new ItemsController()


// utilizando o método index da classe ItemsController - objeto itemsController
routes.get('/items', itemsController.index);
// listar vários
routes.get('/points', pointsController.index );
// listar único
routes.get('/points/:id', pointsController.show );


// utilizando o método create da classe PointsController - objeto pointsController
routes.post('/points'
            , upload.single('image')
            
            , pointsController.create 
            );


export default routes;