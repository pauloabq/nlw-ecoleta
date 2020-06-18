// Importando os tipos Request  Response do express
import {Request, Response} from 'express'
import knex from '../database/connection'


class ItemsController {

    async index (request: Request, response: Response) {

        const items = await knex('items').select('*')

        // map: cria novo array, iterando cada item, e retornando os valores para o novo.
        const serializedItems = items.map( item =>{
            return {
                id: item.id
                ,title: item.title
                //,image_url: `http://localhost:3333/uploads/${item.image}`
                ,image_url: `${process.env.SERVER_NAME}/uploads/${item.image}`
            } 
        })
        return response.json(serializedItems);
    }

}
export default ItemsController;