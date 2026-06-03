# 📁 Digital File Movement & Approval System

A full-stack MERN application providing a **workflow-based file approval management system** — similar to government and enterprise office file movement systems. Built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Charts | Recharts |
| Notifications | react-hot-toast |
| Icons | react-icons |

---

## 📋 Features

### 🔐 Authentication
- User Registration & Login
- JWT-based authentication (7-day expiry)
- Password hashing with bcrypt (12 salt rounds)
- Protected routes & Role-Based Access Control
- Auto logout on token expiry
- Dark mode toggle (persisted in localStorage)

### 👥 User Roles
| Role | Capabilities |
|------|-------------|
| **Employee** | Create, edit, delete own files; track status; view history |
| **Admin/Officer** | View all files; approve/reject/return files; add remarks; access approval queue |

### 📂 File Request Module
- Create file requests with title, description, department, category, priority
- Optional file attachment (PDF, DOC, DOCX, JPG, PNG — max 5MB)
- Edit files when status is `Submitted` or `Returned`
- Delete own files (admin can delete any)
- Full approval history timeline

### ✅ Approval Workflow
```
Submitted → Under Review → Approved
                        → Rejected  (remarks required)
                        → Returned  (remarks required)
Returned  → Submitted   (after employee edits)
```

### 📊 Dashboard
- Stats cards: Total, Approved, Under Review, Submitted, Rejected, Returned
- Pie chart: Files by Category
- Bar chart: Files by Department
- Recent files list

### 🔍 Search & Filter
- Debounced text search (title + description)
- Filter by Department, Status, Priority
- Sort by Latest / Priority / Status
- Grid / Table view toggle
- Pagination (10 per page)

---

## 📁 Project Structure

```
DigitalFile/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # register, login, getMe
│   │   ├── fileController.js     # CRUD + search/filter/pagination
│   │   ├── approvalController.js # State machine + pending queue
│   │   └── dashboardController.js# Aggregation stats
│   ├── middleware/
│   │   ├── authMiddleware.js     # protect + authorizeRoles
│   │   └── errorMiddleware.js    # Central error handler
│   ├── models/
│   │   ├── User.js               # name, email, password, role, department
│   │   └── File.js               # Full file schema + approvalHistory
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── fileRoutes.js         # Multer file upload
│   │   ├── approvalRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── seedRoutes.js         # Demo data seeder
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/                  # Uploaded attachments
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Routes + dark mode
    │   ├── main.jsx
    │   ├── index.css             # Tailwind + component classes
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── services/             # Axios API calls
    │   │   ├── api.js            # Axios instance + JWT interceptor
    │   │   ├── authService.js
    │   │   ├── fileService.js
    │   │   ├── approvalService.js
    │   │   └── dashboardService.js
    │   ├── hooks/
    │   │   └── useDebounce.js
    │   ├── layouts/
    │   │   └── MainLayout.jsx    # Sidebar + Navbar wrapper
    │   ├── components/           # Reusable UI components
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx       # Mobile-responsive drawer
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── InputField.jsx
    │   │   ├── StatusBadge.jsx
    │   │   ├── FileCard.jsx
    │   │   ├── FileTable.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── FilterDropdown.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── DashboardCards.jsx
    │   │   ├── ApprovalModal.jsx
    │   │   ├── ApprovalTimeline.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── EmptyState.jsx
    │   └── pages/
    │       ├── LoginPage.jsx
    │       ├── RegisterPage.jsx
    │       ├── DashboardPage.jsx
    │       ├── FileListPage.jsx
    │       ├── FileDetailPage.jsx
    │       ├── CreateFilePage.jsx
    │       ├── EditFilePage.jsx
    │       ├── ApprovalQueuePage.jsx
    │       └── NotFoundPage.jsx
    ├── .env
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account
- npm v9+

---

### Step 1 — Clone / navigate to project

```bash
cd "c:\Users\VardhanReddyMaram\OneDrive - CriticalRiver Technologies Pvt. Ltd\Desktop\DigitalFile"
```

---

### Step 2 — Backend Setup

```bash
cd backend
npm install
```

**Configure `.env`** (already created — verify values):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/digitalfile
JWT_SECRET=digitalfile_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> 💡 **MongoDB Atlas**: Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<user>:<pass>@cluster.mongodb.net/digitalfile?retryWrites=true&w=majority`

**Start backend:**
```bash
npm run dev
```
✅ Server runs at `http://localhost:5000`

---

### Step 3 — Seed Demo Data

After starting the backend, seed the database with sample data:

```bash
# Using curl:
curl -X POST http://localhost:5000/api/seed/run

# Or open in browser / Postman:
POST http://localhost:5000/api/seed/run
```

This creates:
- 1 Admin account
- 2 Employee accounts
- 5 sample files (covering all status types)

**Demo Login Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@digitalfile.com` | `Admin@123` |
| Employee | `ravi@digitalfile.com` | `Employee@123` |
| Employee | `priya@digitalfile.com` | `Employee@123` |

---

### Step 4 — Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
✅ App runs at `http://localhost:3000`

---

## 🌐 API Reference

### Authentication

| Method | Endpoint | Access | Body |
|--------|----------|--------|------|
| `POST` | `/api/auth/register` | Public | `{name, email, password, confirmPassword, role, department}` |
| `POST` | `/api/auth/login` | Public | `{email, password}` |
| `GET` | `/api/auth/me` | 🔒 Auth | — |

### Files

| Method | Endpoint | Access | Notes |
|--------|----------|--------|-------|
| `GET` | `/api/files` | 🔒 Auth | Supports `?search=&status=&department=&priority=&page=&limit=&sortBy=&order=` |
| `POST` | `/api/files` | 🔒 Auth | multipart/form-data (attachment optional) |
| `GET` | `/api/files/:id` | 🔒 Auth | |
| `PUT` | `/api/files/:id` | 🔒 Owner | Only if status is Submitted or Returned |
| `DELETE` | `/api/files/:id` | 🔒 Owner/Admin | |

### Approval (Admin only)

| Method | Endpoint | Access | Body |
|--------|----------|--------|------|
| `GET` | `/api/approval/pending` | 🔒 Admin | `?page=&limit=&department=&priority=` |
| `PUT` | `/api/approval/:id/action` | 🔒 Admin | `{action: "review"|"approve"|"reject"|"return", remarks: "..."}` |

### Dashboard

| Method | Endpoint | Access | Response |
|--------|----------|--------|----------|
| `GET` | `/api/dashboard/stats` | 🔒 Auth | Status counts, dept/category aggregations, recent files |

### Seed

| Method | Endpoint | Notes |
|--------|----------|-------|
| `POST` | `/api/seed/run` | ⚠️ Clears DB and creates demo data |

---

## 🧪 Postman Testing Examples

### 1. Register a User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test Employee",
  "email": "test@company.com",
  "password": "Test@1234",
  "confirmPassword": "Test@1234",
  "role": "employee",
  "department": "IT"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@digitalfile.com",
  "password": "Admin@123"
}
```
**Response:** `{ "data": { "token": "eyJ..." } }`  
Copy the token and use it as `Authorization: Bearer <token>` for all protected routes.

### 3. Create File Request
```http
POST http://localhost:5000/api/files
Authorization: Bearer <employee_token>
Content-Type: application/json

{
  "title": "New Policy Document Request",
  "description": "Request to create and approve a new remote work policy for all departments covering WFH guidelines.",
  "department": "HR",
  "category": "Policy",
  "priority": "High"
}
```

### 4. Get Files with Filters
```http
GET http://localhost:5000/api/files?status=Submitted&department=HR&page=1&limit=5&sortBy=createdAt&order=desc
Authorization: Bearer <token>
```

### 5. Approve a File (Admin)
```http
PUT http://localhost:5000/api/approval/<file_id>/action
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "approve",
  "remarks": "Reviewed and approved. Please proceed."
}
```

### 6. Reject a File (Admin — remarks required)
```http
PUT http://localhost:5000/api/approval/<file_id>/action
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "action": "reject",
  "remarks": "Incomplete documentation. Please resubmit with all required attachments."
}
```

### 7. Dashboard Stats
```http
GET http://localhost:5000/api/dashboard/stats
Authorization: Bearer <token>
```

---

## 🎨 UI Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | All |
| My Files / All Files | `/files` | All |
| File Details | `/files/:id` | All |
| Create Request | `/files/new` | Employee |
| Edit Request | `/files/:id/edit` | Employee (owner) |
| Approval Queue | `/approval` | Admin |
| 404 | `*` | — |

---

## 🔒 Status Transition Rules

```
┌─────────────┬───────────────────────────────────────────────┐
│ Current     │ Allowed Next States                           │
├─────────────┼───────────────────────────────────────────────┤
│ Submitted   │ Under Review, Rejected                        │
│ Under Review│ Approved, Rejected, Returned                  │
│ Returned    │ Under Review (after employee edits)           │
│ Approved    │ (terminal — no further transitions)           │
│ Rejected    │ (terminal — no further transitions)           │
└─────────────┴───────────────────────────────────────────────┘
```

**Rules:**
- Remarks are **mandatory** when Rejecting or Returning
- Employees can only edit files in `Submitted` or `Returned` state
- Admin can delete any file; employees can only delete their own

---

## 🌙 Dark Mode

The app supports full dark mode:
- Auto-detects system preference on first load
- Toggle button in the Navbar
- Preference saved in `localStorage`
- Applies to all components via Tailwind `dark:` classes

---

## 📦 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/digitalfile
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 Running Both Servers

Open **two terminal windows**:

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Visit: **http://localhost:3000**

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongoDB connection failed` | Ensure MongoDB is running: `mongod` or use Atlas URI |
| `CORS error` | Backend CORS is set to `http://localhost:5173` and `http://localhost:3000` — update if port differs |
| `JWT invalid` | Clear localStorage in browser DevTools and log in again |
| `File upload fails` | Ensure `backend/uploads/` directory exists |
| Frontend `404 on refresh` | Normal in dev; add `historyApiFallback` or deploy with proper server config |

---

## 📄 License

MIT License — Free to use for learning and production.

---

**Built with ❤️ using the MERN stack.**
