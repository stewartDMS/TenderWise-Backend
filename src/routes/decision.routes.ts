import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';
import { authMiddleware } from '../middleware/auth';
import { analysisLimiter } from '../middleware/rateLimiter';

const router = Router();

// All decision routes require authentication
router.use(analysisLimiter, authMiddleware);

/**
 * @route   POST /api/decision
 * @desc    Get bid/no-bid decision for a tender
 * @access  Private
 */
router.post('/', analysisController.analyzeBidDecision);

export default router;
