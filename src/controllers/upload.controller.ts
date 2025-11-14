import { Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { AuthRequest } from '../middleware/auth';

export const uploadController = {
  async uploadDocuments(req: AuthRequest, res: Response, next: NextFunction) {
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

      if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
      }

      const files = Array.isArray(req.files) ? req.files : [req.files];

      const documents = await uploadService.uploadDocuments(
        tenderId,
        req.user.id,
        files as Express.Multer.File[]
      );

      res.status(201).json({
        message: 'Documents uploaded successfully',
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  },

  async getDocuments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { tenderId } = req.params;

      const documents = await uploadService.getDocuments(tenderId, req.user.id);

      res.status(200).json({
        data: documents,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const { documentId } = req.params;

      const result = await uploadService.deleteDocument(documentId, req.user.id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
