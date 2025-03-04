import { Request, Response, NextFunction } from 'express';
import { knex } from '@/database/knex';
import { z } from 'zod';

class TablesSessionsController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({ 
        table_id: z.number(),
      })

      const { table_id } = bodySchema.parse(req.body);

      await knex<TablesSessionsRepository>('tables_sessions').insert({
        table_id,
        opened_at: knex.fn.now(),
      });

      return res.status(201).json()
    } catch (error) {
      next(error);
    }
  }
}

export { TablesSessionsController };