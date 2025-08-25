// // backend/src/app.js
// const express = require('express');
// const { PrismaClient } = require('@prisma/client');
// const bcrypt = require('bcrypt');
// require('dotenv').config();

// const app = express();
// const prisma = new PrismaClient();
// const port = 5000;

// app.use(express.json());

// // Enable CORS for frontend
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// // Sign-up route
// app.post('/api/signup', async (req, res) => {
//   const { email, password } = req.body;
  
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     return res.status(409).json({ error: 'This email is already registered' });
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
  
//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//       },
//     });
//     res.status(201).json({ message: 'User created successfully', user: newUser.email });
//   } catch (err) {
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// // Login route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(401).json({ error: 'Invalid email or password' });
//   }

//   res.status(200).json({ message: 'Login successful', user: user.email });
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });




// backend/src/app.js
const express = require('express');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
require('dotenv').config({ path: '../.env' }); // Make sure to use the correct path

const app = express();
const port = 5000;

// Connect to the database
connectDB();

app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Mount the authentication routes
app.use('/api', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});