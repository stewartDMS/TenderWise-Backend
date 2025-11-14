# TenderWise Backend - Quick Start Guide

## Prerequisites
- Node.js v16+ installed
- PostgreSQL database (Neon recommended)
- OpenAI API key

## Setup Instructions

### 1. Clone and Install
```bash
git clone https://github.com/stewartDMS/TenderWise-Backend.git
cd TenderWise-Backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
NODE_ENV=development

# Get from Neon.tech or your PostgreSQL provider
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# Generate a secure random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Get from OpenAI Platform
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4

# Optional: Adjust file upload settings
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Optional: Configure CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Set Up Database

Generate Prisma Client:
```bash
npm run prisma:generate
```

Run database migrations:
```bash
npm run prisma:migrate
```

This will create all required tables:
- users
- companies
- tenders
- documents
- line_items
- analyses

### 4. Start the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production mode:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

### 5. Test the API

Check health status:
```bash
curl http://localhost:3000/health
```

Register a user:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

## Database Management

View database in Prisma Studio:
```bash
npm run prisma:studio
```

## Project Structure

```
TenderWise-Backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── index.ts         # App entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── uploads/             # Uploaded files
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API documentation.

## Key Features

✅ **Authentication**: JWT-based auth with bcrypt password hashing
✅ **File Upload**: Multi-file support for PDF, DOCX, XLSX
✅ **AI Analysis**: OpenAI integration for risk and decision analysis
✅ **Rate Limiting**: Built-in protection against abuse
✅ **Error Handling**: Comprehensive error middleware
✅ **Type Safety**: Full TypeScript support
✅ **Database**: Prisma ORM with PostgreSQL

## Common Issues

### Database Connection Error
Ensure your `DATABASE_URL` is correct and the database is accessible.

### OpenAI API Error
Verify your `OPENAI_API_KEY` is valid and has sufficient credits.

### File Upload Error
Check that the `uploads/` directory exists and has write permissions.

### Port Already in Use
Change the `PORT` in your `.env` file to use a different port.

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong `JWT_SECRET` (32+ characters)
3. Configure proper CORS origins
4. Set up HTTPS
5. Use environment-based configuration
6. Enable database connection pooling
7. Set up monitoring and logging

## Support

For issues and questions:
- Create an issue on GitHub
- Check the API documentation
- Review the code examples

## License

ISC
