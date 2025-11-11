# 🔗 ReLink  
### _Shorten, manage and share links with ease_

ReLink is a modern **URL Shortener Web App** built using the **MERN Stack (MongoDB, Express, React, Node.js)** with **TypeScript** for both backend and frontend.  
It allows users to register, log in, and shorten long URLs into simple, shareable links — all managed through a user-friendly dashboard.

---

## 🚀 Features

- ✅ **User Authentication** (Register & Login)  
- ✅ **JWT-based Authorization** for secure user sessions  
- ✅ **Repository Pattern Architecture** implemented in the backend for scalability, modularity, and clean testing  
- ✅ **Clean Separation of Concerns** (Controllers → Services → Repositories → Models)  
- ✅ **Shorten Long URLs** using unique short IDs generated via NanoID  
- ✅ **View, Copy, and Manage URLs** through a user-friendly dashboard  
- ✅ **Password Hashing** with bcryptjs for enhanced security  
- ✅ **Cookie-based Authentication** for persistent login sessions  
- ✅ **Frontend built with React + Vite + Tailwind CSS** for a fast and responsive UI  
- ✅ **Fully written in TypeScript** ensuring type safety across both frontend and backend  

---

## 🧠 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React + Vite + TypeScript |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB (Mongoose ORM) |
| **Authentication** | JWT + Cookies |
| **UI Styling** | Tailwind CSS |
| **Utilities** | Axios, React Router, React Toastify |
| **Deployment** | Vercel (Frontend), AWS EC2 (Backend) |

---

## 🧱 Folder Structure
```bash
akshaypnair-relink/
├── backend/
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   │   └── db.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   └── urlController.ts
│   │   ├── enums/
│   │   │   └── statusCodes.ts
│   │   ├── errors/
│   │   │   ├── AppError.ts
│   │   │   └── ErrorCode.ts
│   │   ├── interfaces/
│   │   │   ├── IAuthService.ts
│   │   │   ├── IUrlRepository.ts
│   │   │   ├── IUrlService.ts
│   │   │   └── IUserRepository.ts
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorMiddleware.ts
│   │   ├── models/
│   │   │   ├── urlModel.ts
│   │   │   └── userModel.ts
│   │   ├── repositories/
│   │   │   ├── urlRepository.ts
│   │   │   └── userRepository.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   └── urlRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   └── urlService.ts
│   │   └── utils/
│   │       ├── generateShortId.ts
│   │       ├── generateToken.ts
│   │       └── hashPassword.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── api.ts
    │   │   ├── authService.ts
    │   │   └── urlService.ts
    │   ├── components/
    │   │   └── ProtectedRoute.tsx
    │   ├── hooks/
    │   │   ├── useAuth.ts
    │   │   └── useUrl.ts
    │   └── pages/
    │       ├── Dashboard.tsx
    │       ├── Login.tsx
    │       └── Register.tsx
    ├── package.json
    └── vite.config.ts
```

---

## ⚙️ Environment Variables

Create a `.env` file inside your **backend** folder and add the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
BASE_URL=http://0.0.0.0:8000
FRONTEND_BASE_URL=https://yourfrontendurl.com
ACCESS_TOKEN_SECRET=your_secret_key
```

## 🧩 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user and get JWT |
| `GET` | `/api/auth/profile` | Get user profile (Protected) |

---

### 🔗 URL Shortener

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/api/url/shorten` | Create short URL |
| `GET` | `/api/url/:shortId` | Redirect to original URL |
| `GET` | `/api/url/user/:id` | Get user’s all shortened URLs |

---

## 💻 Installation and Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/relink.git
cd relink
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 🌐 Deployment

### **Frontend – Vercel**
1. Push your frontend folder to GitHub  
2. Connect it to [Vercel](https://vercel.com)  
3. Set environment variables (`VITE_API_BASE_URL`)

---

### **Backend – AWS EC2**
1. SSH into your EC2 instance  
2. Clone your repository  
3. Install Node.js & PM2  
4. Run the following commands:
```bash
npm install
npm run build
pm2 start dist/server.js
```

## 🧭 Project Flow

1. User registers or logs in  
2. JWT is generated and stored in cookies  
3. Authenticated user can shorten URLs  
4. URLs are stored in MongoDB with **nanoid-generated short IDs**  
5. Accessing a short URL redirects to the **original full link**

---

## 🧰 Scripts

### **Backend**

| Script | Description |
|--------|-------------|
| `npm run dev` | Run with tsx |
| `npm run build` | Compile TypeScript |
| `npm start` | Start compiled server |

### **Frontend**

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build production files |
| `npm run preview` | Preview production build |

---

## 👨‍💻 Author

**Akshay P Nair**  
💼 MERN Stack Developer 

---

## 🪶 License

This project is licensed under the **ISC License**.

---

## ⭐ Show your support

If you found this project helpful, please consider giving it a ⭐ on GitHub!

