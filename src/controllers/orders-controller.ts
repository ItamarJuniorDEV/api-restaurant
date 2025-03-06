import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { knex } from '@/database/knex'; 
import { z } from 'zod';

interface TablesSessionsRepository {
  id: number;
  closed_at: Date | null;
}

interface ProductRepository {
  id: number;
  price: number;
  name: string;
}

interface OrderRepository {
  id?: number;
  table_session_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at?: Date;
  updated_at?: Date;
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
      const { table_session_id } = req.params;

      const order = await knex<OrderRepository>('orders')
      .select(
        'orders.id',
        'orders.table_session_id',
        'orders.product_id',
        'products.name',
        'orders.price',
        'orders.quantity',
        knex.raw('(orders.price * orders.quantity) AS total'),
        'orders.created_at',
        'orders.updated_at'
      )
      .join('products', 'products.id', 'orders.product_id')
      .where({ table_session_id })
      .orderBy('orders.created_at', 'desc');

      return res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const { table_session_id } = req.params;

      const order = await knex<OrderRepository>('orders')
      .select(
        (knex.raw('COALESCE(SUM(orders.price * orders.quantity), 0) AS total')),
        (knex.raw('COALESCE(SUM(orders.quantity), 0) AS quantity'))
      )
      .where({ table_session_id: Number(table_session_id) })
      .first();

      return res.json(order);
    } catch (error) {
      next(error);
    }  
  }
}

export { OrdersController };