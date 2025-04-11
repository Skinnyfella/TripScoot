import dotenv from 'dotenv';
dotenv.config();

const allowedOrigins = [
  'http://localhost:5173',  // Local development
  'http://localhost:4173',  // Local preview
  'https://tripscout.vercel.app',  // Production
  'https://trip-scout-onggvdu18-skinnyfellas-projects.vercel.app',  // Vercel preview
  /^https:\/\/.*\.vercel\.app$/,  // Any Vercel deployment URL
];

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman or curl requests)
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }

    // Check if the origin is allowed or matches any pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // CORS preflight cache time in seconds
};
