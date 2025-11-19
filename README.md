# TenderWise Backend

AI-powered tender automation platform that parses PDF, Word and Excel tender packs, extracts scope and BOQs, identifies risks, assists pricing, and generates draft proposals. Includes a bid/no-bid decision engine with win probability scoring to help contractors tender faster and improve win rates.

## 🚀 Features

- **JWT Authentication** - Secure user authentication with JWT tokens
- **Multi-file Upload** - Support for PDF, DOCX, and XLSX file uploads
- **Document Parsing** - Extract text and data from tender documents
- **AI-Powered Analysis**
  - Risk assessment with scoring
  - Bid/no-bid decision recommendations
  - Win probability estimation
  - Line item extraction from BOQs
- **RESTful API** - Complete REST API with Express
- **Database** - PostgreSQL with Prisma ORM
- **TypeScript** - Full type safety

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database (Neon recommended)
- OpenAI API key

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/stewartDMS/TenderWise-Backend.git
cd TenderWise-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string (Neon)
- `JWT_SECRET` - Secret key for JWT tokens
- `OPENAI_API_KEY` - Your OpenAI API key

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Access Prisma Studio
```bash
npm run prisma:studio
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Check if backend is running (no authentication required)

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Tenders (`/api/tenders`)
- `POST /api/tenders` - Create tender
- `GET /api/tenders` - Get all tenders
- `GET /api/tenders/:id` - Get tender by ID
- `PUT /api/tenders/:id` - Update tender
- `DELETE /api/tenders/:id` - Delete tender

### Upload (`/api/upload`)
- `POST /api/upload` - Upload documents (PDF, DOCX, XLSX)
- `GET /api/upload/tender/:tenderId` - Get tender documents
- `DELETE /api/upload/:documentId` - Delete document

### Analysis (`/api/analyze`)
- `POST /api/analyze/risk` - Analyze tender risk
- `GET /api/analyze/tender/:tenderId` - Get all analyses
- `GET /api/analyze/:analysisId` - Get analysis by ID

### Decision (`/api/decision`)
- `POST /api/decision` - Get bid/no-bid recommendation

## 🗄️ Database Models

- **User** - User accounts
- **Company** - Company information
- **Tender** - Tender projects
- **Document** - Uploaded documents
- **LineItem** - Bill of Quantities items
- **Analysis** - AI analysis results

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## 📝 Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your-openai-key
OPENAI_MODEL=gpt-4
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
CORS_ORIGIN=http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── index.ts         # Application entry point

prisma/
└── schema.prisma    # Database schema

uploads/             # Uploaded files directory
```

## 🔧 Technologies

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database (Neon)
- **OpenAI** - AI analysis
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📄 License

ISC

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

