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
                .where('city', 'like', `%${String(city).toLowerCase()}%`)
                .where('uf', 'like', `%${String(uf).toLowerCase()}%`)
                .distinct();

            const pointsItems = [];
            for(let i=0; i < points.length; i++){

                points[i].image = `http://192.168.1.9:3001/uploads/${points[i].image}`;

                const items = await knex('items')
                    .select('items.title')
                    .join('point_items', 'items.id', '=', 'point_items.item_id')
                    .where('point_items.point_id', '=', points[i].id)
                
                pointsItems.push({ ...points[i], items });
            };

            return res.json(pointsItems);

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

            point.image = `http://192.168.1.9:3001/uploads/${point.image}`;

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
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude: Number(latitude),
            longitude: Number(longitude),
            city: String(city).toLowerCase(),
            uf: String(uf).toLowerCase(),
        };

        try {

            const trx = await knex.transaction();
            
            const [ point_id ] = await trx('points').insert(point);

            const pointItems = items
                .split(',')
                .map( (item: string) => ({
                        point_id,
                        item_id: Number(item.trim())
                }));
            
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