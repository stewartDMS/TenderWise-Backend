# TenderWise API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Health Check

### Check API Status
**GET** `/health`

A simple health check endpoint to verify the backend is running and reachable.

**No authentication required**

**Response:**
```json
{
  "status": "ok",
  "message": "TenderWise Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "companyId": "optional-company-id"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "companyId": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

### Login
**POST** `/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

### Get Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "companyId": null,
    "company": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Tender Endpoints

### Create Tender
**POST** `/tenders`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "City Hall Construction Project",
  "description": "Construction of new city hall building",
  "clientName": "City Council",
  "deadline": "2024-12-31T23:59:59.000Z",
  "budget": 1000000,
  "companyId": "optional-company-id"
}
```

**Response:**
```json
{
  "message": "Tender created successfully",
  "data": {
    "id": "uuid",
    "title": "City Hall Construction Project",
    "description": "Construction of new city hall building",
    "clientName": "City Council",
    "deadline": "2024-12-31T23:59:59.000Z",
    "status": "draft",
    "budget": 1000000,
    "userId": "uuid",
    "companyId": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get All Tenders
**GET** `/tenders`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (optional): Filter by status (draft, in_progress, submitted, won, lost)
- `companyId` (optional): Filter by company ID

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "City Hall Construction Project",
      "clientName": "City Council",
      "status": "draft",
      "documents": [],
      "lineItems": [],
      "analyses": []
    }
  ]
}
```

### Get Tender by ID
**GET** `/tenders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "title": "City Hall Construction Project",
    "description": "Construction of new city hall building",
    "clientName": "City Council",
    "deadline": "2024-12-31T23:59:59.000Z",
    "status": "draft",
    "budget": 1000000,
    "documents": [],
    "lineItems": [],
    "analyses": []
  }
}
```

### Update Tender
**PUT** `/tenders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Updated Title",
  "status": "in_progress"
}
```

### Delete Tender
**DELETE** `/tenders/:id`

**Headers:**
```
Authorization: Bearer <token>
```

---

## Upload Endpoints

### Upload Documents
**POST** `/upload`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `tenderId`: Tender ID (string)
- `files`: Multiple files (PDF, DOCX, XLSX)

**Response:**
```json
{
  "message": "Documents uploaded successfully",
  "data": [
    {
      "id": "uuid",
      "tenderId": "uuid",
      "filename": "document-123456789.pdf",
      "originalName": "tender_requirements.pdf",
      "fileType": "application/pdf",
      "fileSize": 1024000,
      "filePath": "./uploads/document-123456789.pdf",
      "uploadedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Tender Documents
**GET** `/upload/tender/:tenderId`

**Headers:**
```
Authorization: Bearer <token>
```

### Delete Document
**DELETE** `/upload/:documentId`

**Headers:**
```
Authorization: Bearer <token>
```

---

## Analysis Endpoints

### Analyze Tender Risk
**POST** `/analyze/risk`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "tenderId": "uuid"
}
```

**Response:**
```json
{
  "message": "Risk analysis completed",
  "data": {
    "id": "uuid",
    "tenderId": "uuid",
    "analysisType": "risk",
    "summary": "Risk assessment completed. Risk score: 45",
    "details": {
      "riskScore": 45,
      "risks": [
        {
          "category": "Timeline",
          "description": "Tight deadline",
          "severity": "medium"
        }
      ],
      "recommendations": ["Allocate additional resources"]
    },
    "riskScore": 45,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Bid Decision
**POST** `/decision`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "tenderId": "uuid"
}
```

**Response:**
```json
{
  "message": "Bid decision analysis completed",
  "data": {
    "id": "uuid",
    "tenderId": "uuid",
    "analysisType": "decision",
    "summary": "Bid decision analysis completed. Recommendation: bid",
    "details": {
      "winProbability": 75,
      "recommendation": "bid",
      "factors": ["Strong client relationship", "Competitive pricing"],
      "reasoning": "High win probability based on factors..."
    },
    "winProbability": 75,
    "recommendation": "bid",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Tender Analyses
**GET** `/analyze/tender/:tenderId`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): Filter by analysis type (risk, decision, pricing, scope)

### Get Analysis by ID
**GET** `/analyze/:analysisId`

**Headers:**
```
Authorization: Bearer <token>
```

---

## Rate Limits

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Upload endpoints**: 10 requests per 15 minutes per IP
- **Analysis endpoints**: 10 requests per 15 minutes per IP
- **General API endpoints**: 100 requests per 15 minutes per IP

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Tender not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Internal server error"
}
```
