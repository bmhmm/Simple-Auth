// backend/src/config/db.js
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '../../.env' }); // Make sure to use the correct path

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to the database successfully.');
  } catch (error) {
    console.error('❌ Database connection failed!', error);
    process.exit(1);
  }
}

module.exports = { connectDB, prisma };