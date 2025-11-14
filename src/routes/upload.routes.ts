import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';
import { uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

// All upload routes require authentication
router.use(uploadLimiter, authMiddleware);

/**
 * @route   POST /api/upload
 * @desc    Upload documents for a tender
 * @access  Private
 */
router.post('/', uploadMultiple, uploadController.uploadDocuments);

/**
 * @route   GET /api/upload/tender/:tenderId
 * @desc    Get all documents for a tender
 * @access  Private
 */
router.get('/tender/:tenderId', uploadController.getDocuments);

/**
 * @route   DELETE /api/upload/:documentId
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/:documentId', uploadController.deleteDocument);

export default router;
