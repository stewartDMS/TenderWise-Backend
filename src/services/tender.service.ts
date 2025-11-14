import prisma from '../utils/database';
import { AppError } from '../middleware/error';

export const tenderService = {
  async create(data: {
    title: string;
    description?: string;
    clientName: string;
    deadline?: Date;
    budget?: number;
    userId: string;
    companyId?: string;
  }) {
    const tender = await prisma.tender.create({
      data: {
        title: data.title,
        description: data.description,
        clientName: data.clientName,
        deadline: data.deadline,
        budget: data.budget,
        userId: data.userId,
        companyId: data.companyId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return tender;
  },

  async getAll(userId: string, filters?: { status?: string; companyId?: string }) {
    const where: any = { userId };

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.companyId) {
      where.companyId = filters.companyId;
    }

    const tenders = await prisma.tender.findMany({
      where,
      include: {
        documents: {
          select: {
            id: true,
            filename: true,
            fileType: true,
            uploadedAt: true,
          },
        },
        lineItems: {
          select: {
            id: true,
          },
        },
        analyses: {
          select: {
            id: true,
            analysisType: true,
            riskScore: true,
            winProbability: true,
            createdAt: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tenders;
  },

  async getById(id: string, userId: string) {
    const tender = await prisma.tender.findFirst({
      where: { id, userId },
      include: {
        documents: true,
        lineItems: true,
        analyses: {
          orderBy: { createdAt: 'desc' },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
          },
        },
      },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    return tender;
  },

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      clientName?: string;
      deadline?: Date;
      status?: string;
      budget?: number;
    }
  ) {
    const tender = await prisma.tender.findFirst({
      where: { id, userId },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    const updated = await prisma.tender.update({
      where: { id },
      data,
      include: {
        documents: true,
        lineItems: true,
        analyses: true,
      },
    });

    return updated;
  },

  async delete(id: string, userId: string) {
    const tender = await prisma.tender.findFirst({
      where: { id, userId },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    await prisma.tender.delete({
      where: { id },
    });

    return { message: 'Tender deleted successfully' };
  },
};
