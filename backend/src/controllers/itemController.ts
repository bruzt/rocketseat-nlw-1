import { Request, Response } from 'express';
import knex from '../database/connection';

export default {

    index: async (req: Request, res: Response) => {
        
        try {
            
            const items = await knex('items').select('*');
    
            const serializedItems = items.map( (item) => {
                return {
                    id: item.id,
                    title: item.title,
                    image_url: `http://192.168.1.9:3001/uploads/${item.image}`
                };
            });
    
            return res.json(serializedItems);
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'error' });
        }
    }
}