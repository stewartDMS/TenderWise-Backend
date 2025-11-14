import { Router } from 'express';
import authRoutes from './auth.routes';
import tenderRoutes from './tender.routes';
import uploadRoutes from './upload.routes';
import analyzeRoutes from './analyze.routes';
import decisionRoutes from './decision.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/tenders', tenderRoutes);
router.use('/upload', uploadRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/decision', decisionRoutes);

export default router;
