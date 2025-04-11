import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'http://localhost:4173',  // Local preview
  'https://tripscout.vercel.app',  // Add your production frontend URL here
  'https://tripscout.netlify.app'  // Add any other deployment URLs here
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // CORS preflight cache time in seconds
};
