import { Request, Response } from 'express';

import knex from '../database/connection';

export default {

    index: async (req: Request, res: Response) => {

        const { city, uf, items } = req.query;
        
        const parsedItems = String(items).split(',').map( (item) => Number(item.trim()));

        try {
            
            const points = await knex('points')
                .select('points.*')
                .join('point_items', 'points.id', '=', 'point_items.point_id')
                .whereIn('point_items.item_id', parsedItems)
                .where('city', String(city))
                .where('uf', String(uf))
                .distinct();

            return res.json(points);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'error' });
        }
    },

    show: async (req: Request, res: Response) => {

        const { id } = req.params;

        try {
            
            const point = await knex('points').where('id', id).first();

            if(!point) return res.status(400).json({ message: 'point not found' });

            const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', '=', id)
                .select('items.title')

            return res.json({ point, items });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'error' });
        }
    },

    store: async (req: Request, res: Response) => {

        const {
            image,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        const point = {
            image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=50',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
        };

        try {

            const trx = await knex.transaction();
            
            const [ point_id ] = await trx('points').insert(point);

            const pointItems = items.map( (item: number) => {
                return {
                    point_id,
                    item_id: item
                }
            })
            
            await trx('point_items').insert(pointItems);

            await trx.commit();
                        
            return res.json({
                id: point_id,
                ...point
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'error' });
        }
    }
}