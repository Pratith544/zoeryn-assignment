# Finance Dashboard Backend

A full-stack finance data processing and access control backend built with TypeScript, Next.js App Router, and MongoDB. The system enforces role-based access control (RBAC) with three user roles: Viewer, Analyst, and Admin.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based (stored in httpOnly cookies)
- **API Style**: RESTful API Routes via Next.js Route Handlers
- **Validation**: Zod schema validation
- **Password Hashing**: bcryptjs
- **Security**: bcryptjs hashing, JWT signing with HS256

## Project Overview

The backend provides:
- **User Management**: Create, read, update, and delete users with role-based permissions
- **Financial Records**: Track income and expense records with full CRUD operations
- **Dashboard Analytics**: Real-time summaries, category breakdowns, and trend analysis
- **Role-Based Access Control**: Three roles with granular permissions defined in `constants/roles.ts`

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd zoeryn
   npm install
   ```

2. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/finance_dashboard
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```

   For production, change:
   - `JWT_SECRET` to a strong random string
   - `MONGODB_URI` to your production MongoDB instance
   - `NODE_ENV=production`

3. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

   This creates 3 test users and 30 sample financial records:
   - Admin: `admin@finance.com` / `Admin@1234`
   - Analyst: `analyst@finance.com` / `Analyst@1234`
   - Viewer: `viewer@finance.com` / `Viewer@1234`

   To seed with fresh data (clearing existing records):
   ```bash
   npm run seed -- --fresh
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000/api`

## Folder Structure

```
/
├── app/
│   └── api/
│       ├── auth/
│       │   ├── register/route.ts
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── users/
│       │   ├── route.ts              # GET/POST users
│       │   └── [id]/route.ts         # GET/PATCH/DELETE user by ID
│       ├── records/
│       │   ├── route.ts              # GET/POST records
│       │   └── [id]/route.ts         # GET/PATCH/DELETE record by ID
│       └── dashboard/
│           ├── summary/route.ts       # Aggregated summary stats
│           ├── categories/route.ts    # Category-wise breakdown
│           └── trends/route.ts        # Monthly/weekly trends
├── lib/
│   ├── db.ts                         # MongoDB connection singleton
│   ├── auth.ts                       # JWT utilities
│   ├── middleware.ts                 # Route protection HOF
│   ├── errors.ts                     # Error handling
│   └── validations/
│       ├── auth.ts                   # Auth schemas
│       └── records.ts                # Record schemas
├── models/
│   ├── User.ts                       # User Mongoose schema
│   └── FinancialRecord.ts            # Financial record schema
├── types/
│   └── index.ts                      # TypeScript interfaces
├── constants/
│   └── roles.ts                      # Permissions map
└── scripts/
    └── seed.ts                       # Database seeding script
```

## Role Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| **User Management** | | | |
| View All Users | ❌ | ❌ | ✅ |
| Create User | ❌ | ❌ | ✅ |
| Update User | ❌ | ❌ | ✅ |
| Delete User | ❌ | ❌ | ✅ |
| **Records** | | | |
| View Records | ✅ | ✅ | ✅ |
| Create Record | ❌ | ✅ | ✅ |
| Update Record | ❌ | ✅ | ✅ |
| Delete Record | ❌ | ❌ | ✅ |
| **Dashboard** | | | |
| View Dashboard | ✅ | ✅ | ✅ |
| View Trends | ❌ | ✅ | ✅ |

## API Reference

### Authentication Routes

#### `POST /api/auth/register`
Register a new user.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "viewer"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "status": "active",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

#### `POST /api/auth/login`
Login and receive JWT token via httpOnly cookie.

**Request**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response** (200): Same as register response

JWT token is automatically set in httpOnly cookie `auth_token`.

#### `POST /api/auth/logout`
Clear authentication cookie.

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Management Routes (Admin only)

#### `GET /api/users` - List users
#### `POST /api/users` - Create user
#### `GET /api/users/[id]` - Get user
#### `PATCH /api/users/[id]` - Update user (name, role, status)
#### `DELETE /api/users/[id]` - Soft delete user

### Financial Records Routes

#### `GET /api/records` - List records (with filtering, sorting, pagination)
#### `POST /api/records` - Create record (Analyst+)
#### `GET /api/records/[id]` - Get record
#### `PATCH /api/records/[id]` - Update record (Analyst+)
#### `DELETE /api/records/[id]` - Soft delete record (Admin only)

### Dashboard Routes

#### `GET /api/dashboard/summary` - Get summary stats
#### `GET /api/dashboard/categories` - Get category breakdown
#### `GET /api/dashboard/trends` - Get trends (Analyst+ only)

See README for full API details with examples and query parameters.

## Assumptions Made

1. **Soft Deletes**: Users and records are soft-deleted rather than hard-deleted
2. **Password Hashing**: bcryptjs with 12 salt rounds, never returned in API
3. **JWT Expiry**: 7-day expiry, no refresh token for simplicity
4. **httpOnly Cookies**: Secure token storage with SameSite=strict
5. **Pagination**: 10 items/page default, max 100
6. **MongoDB Indexes**: On date, type, category, isDeleted
7. **Aggregation Pipeline**: Used for efficient dashboard analytics
8. **Date Validation**: Records cannot be more than 1 day in future

## Tradeoffs

- **httpOnly Cookies vs Auth Header**: Using httpOnly for better XSS protection; Authorization header supported as fallback
- **Soft vs Hard Delete**: Soft delete preserves referential integrity and audit trails
- **No Refresh Token**: Simplifies implementation; production would implement refresh tokens
- **Zod for Validation**: Type-safe schema validation with field-level errors

## Build & Deployment

```bash
npm run dev      # Development
npm run build    # Production build
npm run start    # Start production server
npm run seed     # Seed database
```


