import { Response, NextFunction } from 'express';
import { tenderService } from '../services/tender.service';
import { AuthRequest } from '../middleware/auth';

export const tenderController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { title, description, clientName, deadline, budget, companyId } = req.body;

      if (!title || !clientName) {
        res.status(400).json({ error: 'Title and client name are required' });
        return;
      }

      const tender = await tenderService.create({
        title,
        description,
        clientName,
        deadline: deadline ? new Date(deadline) : undefined,
        budget: budget ? parseFloat(budget) : undefined,
        userId: req.user.id,
        companyId,
      });

      res.status(201).json({
        message: 'Tender created successfully',
        data: tender,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { status, companyId } = req.query;

      const tenders = await tenderService.getAll(req.user.id, {
        status: status as string,
        companyId: companyId as string,
      });

      res.status(200).json({
        data: tenders,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const tender = await tenderService.getById(id, req.user.id);

      res.status(200).json({
        data: tender,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const { title, description, clientName, deadline, status, budget } = req.body;

      const tender = await tenderService.update(id, req.user.id, {
        title,
        description,
        clientName,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
        budget: budget ? parseFloat(budget) : undefined,
      });

      res.status(200).json({
        message: 'Tender updated successfully',
        data: tender,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { id } = req.params;

      const result = await tenderService.delete(id, req.user.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
