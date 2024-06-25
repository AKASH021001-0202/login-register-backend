// expressserver.js
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import mongooseDb from "./db.utils/mongoose-connection.js";
import RegisterRouter from "./router/auth/register.js";
import LoginRouter from "./router/auth/login.js";
import studentRouter from "./router/studentdb.js";
import mentorRouter from "./router/teacherdb.js";
import ForgetPassword from "./router/controller/forgetpassword.js";
import ResetPassword from "./router/controller/resetpassword.js";



const server = express();

// Connect to MongoDB using mongoose
await mongooseDb();

// Middleware
server.use(express.json());
server.use(cors());

// Custom middleware to log requests
const customMiddleware = (req, res, next) => {
  console.log(
    new Date().toISOString(),
    'Handling Request',
    req.method,
    req.originalUrl
  );
  next();
};

// Middleware for JWT authorization
const authApi = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ msg: 'Authorization token is missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ msg: 'Token format is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.user.role === 'Teacher' || decoded.user.role === 'Admin') {
      req.user = decoded.user;
      next();
    } else {
      throw new Error('Unauthorized access');
    }
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ msg: 'Not authorized' });
  }
};

// Apply middleware globally
server.use(customMiddleware);

// Routes
server.use('/registers', RegisterRouter);
server.use('/login', LoginRouter);
server.use('/students', studentRouter);
server.use('/mentors', authApi, mentorRouter); // Apply authApi middleware to mentors route
server.use('/forget-password', ForgetPassword); // Forget password route
server.use('/reset-password', ResetPassword); // Forget password route

// Start server
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log('Server is running on port', port);
});
