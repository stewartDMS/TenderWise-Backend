import { Response, NextFunction } from 'express';
import { analysisService } from '../services/analysis.service';
import { AuthRequest } from '../middleware/auth';

export const analysisController = {
  async analyzeRisk(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { tenderId } = req.body;

      if (!tenderId) {
        res.status(400).json({ error: 'Tender ID is required' });
        return;
      }

      const analysis = await analysisService.analyzeRisk(tenderId, req.user.id);

      res.status(201).json({
        message: 'Risk analysis completed',
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  },

  async analyzeBidDecision(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { tenderId } = req.body;

      if (!tenderId) {
        res.status(400).json({ error: 'Tender ID is required' });
        return;
      }

      const analysis = await analysisService.analyzeBidDecision(
        tenderId,
        req.user.id
      );

      res.status(201).json({
        message: 'Bid decision analysis completed',
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAnalyses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { tenderId } = req.params;
      const { type } = req.query;

      const analyses = await analysisService.getAnalyses(
        tenderId,
        req.user.id,
        type as string
      );

      res.status(200).json({
        data: analyses,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAnalysisById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { analysisId } = req.params;

      const analysis = await analysisService.getAnalysisById(
        analysisId,
        req.user.id
      );

      res.status(200).json({
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  },
};
