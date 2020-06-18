// Importando os tipos Request  Response do express
import {Request, Response} from 'express'
import knex from '../database/connection'

class PointsController {

    // tipos Request e Response
    async show(request: Request, response: Response){
        const { id } = request.params;
        const point =  await knex('points').where('id', id).first();
        if(!point){
            return response.status(400).json({message:'Point not found'})
        } else {
            const items = await knex('items')
                                .join('point_items', 'items.id', '=', 'point_items.item_id')
                                .where('point_items.point_id', id)
                                .select('items.title')
                                /*
                                select items.title
                                  from items join point_items 
                                    on items.id = point_items.item_id
                                 where point_items.point_id = x
                                */
            const serializedPoint = {
                    ...point,
                    image_url: `${process.env.SERVER_NAME}/uploads/${point.image}`
            }
            return response.json({ point: serializedPoint, items})
        }
    }

    
    async create(request: Request, response: Response) {
        const {
            name
            ,email
            ,whatsapp
            ,latitude
            ,longitude
            ,city
            ,uf
            ,items
        } = request.body;
        
        // transações. se alguma der erro, rollback em todas
        const trx = await knex.transaction();

        // conteúdo que vem do request.body
        const point = {
            image: request.file.filename
            ,name
            ,email
            ,whatsapp
            ,latitude 
            ,longitude
            ,city
            ,uf
        }

        //método insert retorna o id da última inserção.
        const insertedId = await trx('points').insert(point);

        const point_id = insertedId[0];

        // items vem do request.body - string separada por virgula
        const pointItems = items
                        .split(",")
                        .map((item: string) => Number(item.trim()))
                        .map((item_id: number) =>{
                            return {
                                item_id
                                ,point_id  // id do insert do point
                            }
                        })
try {
        await trx('point_items').insert(pointItems);
   
        await trx.commit();
} catch(err){
    await trx.rollback();
    return response.status(400).json({ message: 'Falha na inserção na tabela point_items, verifique se os items informados são válidos' })
}
        return response.json({
            id: point_id,
            ...point //spread operator: coloca todos os elementos aqui
        });
    }

    async index(request: Request, response: Response){
        // filtro por cidade / uf / items (query params)
        const {city, uf, items } = request.query;

        // separar query string items separado por virgula em array de itens
        const parsedItems = String(items)
                           .split(',')
                           .map(item => Number(item.trim()) )
            
        const points = await knex('points')
                            .join('point_items', 'points.id', '=', 'point_items.point_id')
                            // que tenha pelo menos 1 dos items do array
                            .whereIn('point_items.item_id', parsedItems)
                            .where('city', String(city))
                            .where('uf', String(uf))
                            .distinct()
                            .select('points.*')
        const serializedPoints = points.map( point =>{
            return {
                ...point,
                image_url: `${process.env.SERVER_NAME}/uploads/${point.image}`
            }
        })

        return response.json(serializedPoints)
    }

}

export default PointsController;