import { Router } from 'express';
import { tenderController } from '../controllers/tender.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All tender routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/tenders
 * @desc    Create a new tender
 * @access  Private
 */
router.post('/', tenderController.create);

/**
 * @route   GET /api/tenders
 * @desc    Get all tenders for the authenticated user
 * @access  Private
 */
router.get('/', tenderController.getAll);

/**
 * @route   GET /api/tenders/:id
 * @desc    Get tender by ID
 * @access  Private
 */
router.get('/:id', tenderController.getById);

/**
 * @route   PUT /api/tenders/:id
 * @desc    Update tender
 * @access  Private
 */
router.put('/:id', tenderController.update);

/**
 * @route   DELETE /api/tenders/:id
 * @desc    Delete tender
 * @access  Private
 */
router.delete('/:id', tenderController.delete);

export default router;
