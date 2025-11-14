import prisma from '../utils/database';
import { AppError } from '../middleware/error';
import { analyzeTenderRisk, analyzeBidDecision } from '../utils/openai';

export const analysisService = {
  async analyzeRisk(tenderId: string, userId: string) {
    // Get tender with all related data
    const tender = await prisma.tender.findFirst({
      where: { id: tenderId, userId },
      include: {
        documents: true,
        lineItems: true,
      },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    // Prepare tender data for analysis
    const tenderData = {
      title: tender.title,
      description: tender.description,
      clientName: tender.clientName,
      deadline: tender.deadline,
      budget: tender.budget,
      documentCount: tender.documents.length,
      lineItemCount: tender.lineItems.length,
      totalValue: tender.lineItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      ),
    };

    // Analyze with AI
    const aiAnalysis = await analyzeTenderRisk(tenderData);

    // Save analysis
    const analysis = await prisma.analysis.create({
      data: {
        tenderId,
        analysisType: 'risk',
        summary: `Risk assessment completed. Risk score: ${aiAnalysis.riskScore}`,
        details: aiAnalysis,
        riskScore: aiAnalysis.riskScore,
        aiModel: 'gpt-4',
      },
    });

    return analysis;
  },

  async analyzeBidDecision(tenderId: string, userId: string) {
    // Get tender with all related data
    const tender = await prisma.tender.findFirst({
      where: { id: tenderId, userId },
      include: {
        documents: true,
        lineItems: true,
        analyses: {
          where: { analysisType: 'risk' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    // Prepare tender data for analysis
    const tenderData = {
      title: tender.title,
      description: tender.description,
      clientName: tender.clientName,
      deadline: tender.deadline,
      budget: tender.budget,
      documentCount: tender.documents.length,
      lineItemCount: tender.lineItems.length,
      totalValue: tender.lineItems.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      ),
      riskScore: tender.analyses[0]?.riskScore,
    };

    // Analyze with AI
    const aiAnalysis = await analyzeBidDecision(tenderData);

    // Save analysis
    const analysis = await prisma.analysis.create({
      data: {
        tenderId,
        analysisType: 'decision',
        summary: `Bid decision analysis completed. Recommendation: ${aiAnalysis.recommendation}`,
        details: aiAnalysis,
        winProbability: aiAnalysis.winProbability,
        recommendation: aiAnalysis.recommendation,
        recommendationNote: aiAnalysis.reasoning,
        aiModel: 'gpt-4',
      },
    });

    return analysis;
  },

  async getAnalyses(tenderId: string, userId: string, type?: string) {
    // Verify tender exists and belongs to user
    const tender = await prisma.tender.findFirst({
      where: { id: tenderId, userId },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    const where: any = { tenderId };
    if (type) {
      where.analysisType = type;
    }

    const analyses = await prisma.analysis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return analyses;
  },

  async getAnalysisById(analysisId: string, userId: string) {
    const analysis = await prisma.analysis.findFirst({
      where: {
        id: analysisId,
        tender: {
          userId,
        },
      },
      include: {
        tender: {
          select: {
            id: true,
            title: true,
            clientName: true,
          },
        },
      },
    });

    if (!analysis) {
      throw new AppError('Analysis not found', 404);
    }

    return analysis;
  },
};
