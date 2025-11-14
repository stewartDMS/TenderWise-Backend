import { Router } from 'express';
import { analysisController } from '../controllers/analysis.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All analysis routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/analyze/risk
 * @desc    Analyze tender risk
 * @access  Private
 */
router.post('/risk', analysisController.analyzeRisk);

/**
 * @route   POST /api/decision
 * @desc    Analyze bid/no-bid decision
 * @access  Private
 */
router.post('/', analysisController.analyzeBidDecision);

/**
 * @route   GET /api/analyze/tender/:tenderId
 * @desc    Get all analyses for a tender
 * @access  Private
 */
router.get('/tender/:tenderId', analysisController.getAnalyses);

/**
 * @route   GET /api/analyze/:analysisId
 * @desc    Get analysis by ID
 * @access  Private
 */
router.get('/:analysisId', analysisController.getAnalysisById);

export default router;
