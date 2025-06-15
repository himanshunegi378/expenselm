// This file will run before all tests

// Import the singleton prisma instance
import dotenv from 'dotenv';

// Set NODE_ENV explicitly for tests
process.env.NODE_ENV = 'test';

// Load environment variables
dotenv.config({ path: '.env.test' });
import { prisma } from '../core/db/prisma';

// Use the singleton Prisma instance for testing
export const prismaTest = prisma;

// Global setup
beforeAll(async () => {
  // Reset the database completely before all tests
  await clearDatabase();
});

// Clean up after all tests are done
afterAll(async () => {
  // Disconnect the Prisma client
  await prismaTest.$disconnect();
});

// Helper function to clear the database
async function clearDatabase() {
  // Use $transaction to ensure atomicity
  await prismaTest.$transaction([
    // Order matters due to foreign key constraints
    prismaTest.expense.deleteMany(),
    prismaTest.category.deleteMany(),
    prismaTest.user.deleteMany(),
  ]);
}

// Don't reset tables between each test as it disrupts test flows
// Tests should be written to be independent or to set up their own state
beforeEach(async () => {
  // We could clear data between tests, but for auth tests we want to preserve users
  // created in beforeAll blocks
  
  // Instead of clearing all data, we'll let each test manage its own state
  // This ensures test fixtures created in beforeAll blocks remain available
});
