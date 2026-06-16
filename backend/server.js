const express = require('express');//Express is a Node.js framework used to create APIs and servers.
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); //checking 
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize'); //checking 
const xss = require('xss-clean');// cheking 
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { httpLogger } = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();




// ──────────────────────────3yt───────────────────
// Security Middleware
// ─────────────────────────────────────────────
app.use(helmet({
  crossOriginEmbedderPolicy: false, // allow cross-origin for dev
  contentSecurityPolicy: false,     // disable CSP for dev (enable in prod)
}));

// CORS — whitelist allowed origins with credentials support for HttpOnly cookies
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Cookie Parser — must be before routes to parse HttpOnly cookies
app.use(cookieParser());

// Sanitize data against MongoDB injection attacks
app.use(mongoSanitize());

// Sanitize data against XSS attacks
app.use(xss());

// ─────────────────────────────────────────────
// Body Parsing Middleware
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));



// ─────────────────────────────────────────────
// HTTP Request Logging (development)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(httpLogger);
}

// ─────────────────────────────────────────────
// Rate Limiting — applied to all API routes
// ─────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─────────────────────────────────────────────
// Static Files
// ─────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/files', require('./routes/fileRoutes'));
app.use('/api/approval', require('./routes/approvalRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/history', require('./routes/historyRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Seed route (development only)
if (process.env.NODE_ENV === 'development') {
  app.use('/api/seed', require('./routes/seedRoutes'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Digital File System API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// Error Handlers (must be last)
// ─────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log(`🔒 Security: Helmet ✅ | MongoSanitize ✅ | XSS ✅ | Rate Limit ✅`);
});
