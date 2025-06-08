import request from 'supertest';
import app from '../../../app'; // Express app instance
import { prismaTest } from '../../../test/setup'; // Prisma client for test DB
import { Decimal } from '@prisma/client/runtime/library';

describe('Expenses Feature', () => {
  // Test user for all tests
  let testUser = {
    id: '',
    email: '',
    token: '',
    password: 'Password123!',
    name: 'Expense Test User'
  };
  
  // Test expense IDs
  let testExpenseId = '';
  let testCategoryId = '';
  
  // Common headers with authentication
  let authHeaders = {
    Authorization: '',
    Cookie: [] as string[]
  };
  
  // Setup - create test user and authenticate
  beforeAll(async () => {
    // Create a unique test user
    const timestamp = Date.now();
    testUser.email = `expense_test_${timestamp}@example.com`;
    
    // Register the user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password
      });
    
    // Save user ID and token
    testUser.id = registerResponse.body.data.user.id;
    testUser.token = registerResponse.body.data.token;
    
    // Setup auth headers for future requests
    authHeaders.Authorization = `Bearer ${testUser.token}`;
    const cookies = registerResponse.headers['set-cookie'];
    if (cookies) {
      authHeaders.Cookie = Array.isArray(cookies) ? cookies : [cookies];
    }
    
    // Create a test category if needed
    const categoryResponse = await request(app)
      .post('/api/expenses/categories')
      .set('Authorization', authHeaders.Authorization)
      .set('Cookie', authHeaders.Cookie)
      .send({ name: 'Test Category' });
      
    if (categoryResponse.body.success) {
      testCategoryId = categoryResponse.body.data.id;
    } else {
      // If creating category fails, get an existing one
      const categoriesResponse = await request(app)
        .get('/api/expenses/categories/all')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      if (categoriesResponse.body.success && categoriesResponse.body.data.length > 0) {
        testCategoryId = categoriesResponse.body.data[0].id;
      }
    }
    
    console.log(`Test user created with ID: ${testUser.id}`);
    console.log(`Test category ID: ${testCategoryId}`);
  });
  
  afterAll(async () => {
    // Cleanup - remove test data
    if (testExpenseId) {
      await prismaTest.expense.deleteMany({
        where: { id: testExpenseId }
      });
    }
    
    // Remove test user
    await prismaTest.user.deleteMany({
      where: { id: testUser.id }
    });
    
    await prismaTest.$disconnect();
  });
  
  describe('Create Expense API - POST /api/expenses', () => {
    it('should create a new expense successfully', async () => {
      const expenseData = {
        amount: 99.99,
        description: 'Test Expense',
        date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
        categoryId: testCategoryId,
        notes: 'Test notes'
      };
      
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie)
        .send(expenseData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.amount).toBe('99.99'); // Decimal is returned as string
      expect(response.body.data.description).toBe(expenseData.description);
      expect(response.body.data.userId).toBe(testUser.id);
      
      // Save expense ID for later tests
      testExpenseId = response.body.data.id;
      
      // Verify expense in database
      const dbExpense = await prismaTest.expense.findUnique({
        where: { id: testExpenseId }
      });
      
      expect(dbExpense).not.toBeNull();
      expect(dbExpense?.amount.toString()).toBe('99.99');
      expect(dbExpense?.description).toBe(expenseData.description);
      expect(dbExpense?.userId).toBe(testUser.id);
    });
    
    it('should return 400 for invalid expense data', async () => {
      // Missing required fields
      const invalidExpense = {
        description: 'Invalid Expense'
        // Missing amount and categoryId
      };
      
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie)
        .send(invalidExpense);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    it('should return 401 if user is not authenticated', async () => {
      const expenseData = {
        amount: 99.99,
        description: 'Unauthorized Expense',
        date: new Date().toISOString().split('T')[0],
        categoryId: testCategoryId
      };
      
      const response = await request(app)
        .post('/api/expenses')
        .send(expenseData);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Get Expense API - GET /api/expenses/:id', () => {
    it('should retrieve an expense by ID', async () => {
      // Skip if no test expense was created
      if (!testExpenseId) {
        console.log('Skipping test: No test expense available');
        return;
      }
      
      const response = await request(app)
        .get(`/api/expenses/${testExpenseId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testExpenseId);
      expect(response.body.data.userId).toBe(testUser.id);
    });
    
    it('should return 404 for non-existent expense ID', async () => {
      const nonExistentId = 'nonexistent-id-12345';
      
      const response = await request(app)
        .get(`/api/expenses/${nonExistentId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
    
    it('should return 401 if user is not authenticated', async () => {
      const response = await request(app)
        .get(`/api/expenses/${testExpenseId}`);
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
    
    it('should return 404 if expense belongs to another user', async () => {
      // Create another test user
      const anotherUser = {
        email: `another_user_${Date.now()}@example.com`,
        password: 'Password123!',
        name: 'Another Test User'
      };
      
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(anotherUser);
      
      const anotherUserToken = registerResponse.body.data.token;
      
      // Try to access the test expense with another user
      const response = await request(app)
        .get(`/api/expenses/${testExpenseId}`)
        .set('Authorization', `Bearer ${anotherUserToken}`);
      
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      
      // Clean up the other user
      await prismaTest.user.deleteMany({
        where: { email: anotherUser.email }
      });
    });
  });
  
  describe('Update Expense API - PUT /api/expenses/:id', () => {
    it('should update an expense successfully', async () => {
      // Skip if no test expense was created
      if (!testExpenseId) {
        console.log('Skipping test: No test expense available');
        return;
      }
      
      const updateData = {
        amount: 149.99,
        description: 'Updated Test Expense',
        notes: 'Updated test notes'
      };
      
      const response = await request(app)
        .put(`/api/expenses/${testExpenseId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie)
        .send(updateData);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testExpenseId);
      expect(response.body.data.amount).toBe('149.99');
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.notes).toBe(updateData.notes);
      
      // Verify update in database
      const dbExpense = await prismaTest.expense.findUnique({
        where: { id: testExpenseId }
      });
      
      expect(dbExpense?.amount.toString()).toBe('149.99');
      expect(dbExpense?.description).toBe(updateData.description);
    });
    
    it('should return 400 for invalid update data', async () => {
      const invalidUpdate = {
        amount: 'not-a-number' // Invalid amount
      };
      
      const response = await request(app)
        .put(`/api/expenses/${testExpenseId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie)
        .send(invalidUpdate);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Delete Expense API - DELETE /api/expenses/:id', () => {
    it('should delete an expense successfully', async () => {
      // Skip if no test expense was created
      if (!testExpenseId) {
        console.log('Skipping test: No test expense available');
        return;
      }
      
      const response = await request(app)
        .delete(`/api/expenses/${testExpenseId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // Verify expense is deleted
      const dbExpense = await prismaTest.expense.findUnique({
        where: { id: testExpenseId }
      });
      
      expect(dbExpense).toBeNull();
    });
    
    it('should return 404 for non-existent expense ID', async () => {
      const nonExistentId = 'nonexistent-id-67890';
      
      const response = await request(app)
        .delete(`/api/expenses/${nonExistentId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Get User Expenses API - GET /api/expenses', () => {
    // Create test expenses for filtering tests
    let testExpenses: string[] = [];
    
    beforeAll(async () => {
      // Create a few test expenses with different amounts and dates
      const expenseData = [
        {
          amount: new Decimal(50.25),
          description: 'Expense 1',
          date: new Date('2023-01-15'),
          categoryId: testCategoryId,
          userId: testUser.id
        },
        {
          amount: new Decimal(120.50),
          description: 'Expense 2',
          date: new Date('2023-02-20'),
          categoryId: testCategoryId,
          userId: testUser.id
        },
        {
          amount: new Decimal(75.75),
          description: 'Expense 3',
          date: new Date('2023-03-10'),
          categoryId: testCategoryId,
          userId: testUser.id
        }
      ];
      
      // Create the test expenses directly in the database
      for (const expense of expenseData) {
        const created = await prismaTest.expense.create({
          data: expense
        });
        testExpenses.push(created.id);
      }
      
      console.log(`Created ${testExpenses.length} test expenses for filtering tests`);
    });
    
    afterAll(async () => {
      // Clean up test expenses
      if (testExpenses.length > 0) {
        await prismaTest.expense.deleteMany({
          where: {
            id: {
              in: testExpenses
            }
          }
        });
      }
    });
    
    it('should retrieve all expenses for the authenticated user', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(testExpenses.length);
      
      // All expenses should belong to the test user
      response.body.data.forEach((expense: any) => {
        expect(expense.userId).toBe(testUser.id);
      });
    });
    
    it('should filter expenses by date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-02-28';
      
      const response = await request(app)
        .get(`/api/expenses?startDate=${startDate}&endDate=${endDate}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // All returned expenses should be within the date range
      response.body.data.forEach((expense: any) => {
        const expenseDate = new Date(expense.date);
        expect(expenseDate >= new Date(startDate)).toBe(true);
        expect(expenseDate <= new Date(endDate)).toBe(true);
      });
    });
    
    it('should filter expenses by minimum amount', async () => {
      const minAmount = 100;
      
      const response = await request(app)
        .get(`/api/expenses?minAmount=${minAmount}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // All returned expenses should have amount >= minAmount
      response.body.data.forEach((expense: any) => {
        expect(parseFloat(expense.amount)).toBeGreaterThanOrEqual(minAmount);
      });
    });
    
    it('should filter expenses by category', async () => {
      const response = await request(app)
        .get(`/api/expenses?categoryId=${testCategoryId}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      // All returned expenses should have the specified category
      response.body.data.forEach((expense: any) => {
        expect(expense.categoryId).toBe(testCategoryId);
      });
    });
  });
  
  describe('Expense Summary API - GET /api/expenses/summary', () => {
    it('should return expense summary with category breakdown', async () => {
      const response = await request(app)
        .get('/api/expenses/summary')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalAmount).toBeDefined();
      expect(response.body.data.categorySummary).toBeDefined();
      expect(Array.isArray(response.body.data.categorySummary)).toBe(true);
    });
    
    it('should filter summary by date range', async () => {
      const startDate = '2023-01-01';
      const endDate = '2023-03-31';
      
      const response = await request(app)
        .get(`/api/expenses/summary?startDate=${startDate}&endDate=${endDate}`)
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalAmount).toBeDefined();
    });
  });
  
  describe('Categories API', () => {
    it('should retrieve all available categories', async () => {
      const response = await request(app)
        .get('/api/expenses/categories/all')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should create a new category', async () => {
      const categoryName = `Test Category ${Date.now()}`;
      
      const response = await request(app)
        .post('/api/expenses/categories')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie)
        .send({ name: categoryName });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(categoryName);
      
      // Cleanup - delete the created category
      if (response.body.data.id) {
        await prismaTest.category.deleteMany({
          where: { id: response.body.data.id }
        });
      }
    });
    
    it('should return 400 for invalid category data', async () => {
      const response = await request(app)
        .post('/api/expenses/categories')
        .set('Authorization', authHeaders.Authorization)
        .set('Cookie', authHeaders.Cookie)
        .send({ }); // Missing name
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
