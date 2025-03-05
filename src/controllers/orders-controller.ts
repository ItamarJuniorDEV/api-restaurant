import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { knex } from '@/database/knex'; 
import { z } from 'zod';

interface ProductRepository {
  id: number;
  name: string;
  price: number;
}

interface TablesSessionsRepository {
  id: number;
  table_id: number;
  opened_at: Date;
  closed_at: Date | null;
}

class OrdersController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number()
      })

      const { table_session_id, product_id, quantity } = bodySchema.parse(req.body); 
      
      const session = await knex<TablesSessionsRepository>('tables_sessions')
        .where({ id: table_session_id })
        .first();

      if (!session) {
        throw new AppError('Sessão inexistente', 404)
      }

      if (session.closed_at) {
        throw new AppError('Sessão encerrada', 400)
      }

      const product = await knex<ProductRepository>('products')
        .where({ id: product_id })
        .first();

      if(!product) {
        throw new AppError('Produto não existe', 404)
      } 

      await knex<OrderRepository>('orders')
      .insert({
        table_session_id,
        product_id,
        quantity,
        price: product.price
      })

      return res.status(201).json();
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try{
      return res.json();
    } catch (error) {
      next(error);
    }
  }
}

export { OrdersController };