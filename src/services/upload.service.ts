import prisma from '../utils/database';
import { AppError } from '../middleware/error';
import { parseDocument } from '../utils/documentParser';
import { extractLineItems } from '../utils/openai';

export const uploadService = {
  async uploadDocuments(
    tenderId: string,
    userId: string,
    files: Express.Multer.File[]
  ) {
    // Verify tender exists and belongs to user
    const tender = await prisma.tender.findFirst({
      where: { id: tenderId, userId },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    const uploadedDocuments = [];

    for (const file of files) {
      try {
        // Parse document content
        const parsedData = await parseDocument(file.path, file.mimetype);

        // Create document record
        const document = await prisma.document.create({
          data: {
            tenderId,
            filename: file.filename,
            originalName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            filePath: file.path,
            parsedData: parsedData,
          },
        });

        uploadedDocuments.push(document);

        // Extract line items if it's a spreadsheet or contains BOQ
        if (
          file.mimetype ===
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          parsedData.text?.toLowerCase().includes('bill of quantities')
        ) {
          try {
            const lineItems = await extractLineItems(
              parsedData.text || JSON.stringify(parsedData.data)
            );

            // Create line items
            if (lineItems && lineItems.length > 0) {
              await prisma.lineItem.createMany({
                data: lineItems.map((item) => ({
                  tenderId,
                  documentId: document.id,
                  item: item.item,
                  description: item.description,
                  quantity: item.quantity,
                  unit: item.unit,
                  unitPrice: item.unitPrice,
                  totalPrice: item.quantity && item.unitPrice
                    ? item.quantity * item.unitPrice
                    : null,
                  category: item.category,
                })),
              });
            }
          } catch (error) {
            console.error('Error extracting line items:', error);
            // Continue even if line item extraction fails
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        // Continue processing other files
      }
    }

    return uploadedDocuments;
  },

  async getDocuments(tenderId: string, userId: string) {
    // Verify tender exists and belongs to user
    const tender = await prisma.tender.findFirst({
      where: { id: tenderId, userId },
    });

    if (!tender) {
      throw new AppError('Tender not found', 404);
    }

    const documents = await prisma.document.findMany({
      where: { tenderId },
      orderBy: { uploadedAt: 'desc' },
    });

    return documents;
  },

  async deleteDocument(documentId: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        tender: {
          userId,
        },
      },
    });

    if (!document) {
      throw new AppError('Document not found', 404);
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    // Note: In production, you should also delete the file from disk
    // fs.unlinkSync(document.filePath);

    return { message: 'Document deleted successfully' };
  },
};
