import request from 'supertest';
import app from '../../../app'; // Express app instance
import { prismaTest } from '../../../test/setup'; // Prisma client for test DB

describe('Auth Feature', () => {
  // Global hooks like beforeAll, afterAll, beforeEach from setup.ts will run
  // These local hooks can be used for feature-specific setup/teardown if needed
  beforeAll(async () => {
    // e.g., specific setup for auth tests if any
  });

  afterAll(async () => {
    // e.g., specific teardown for auth tests if any
    await prismaTest.$disconnect(); // Ensure test Prisma client disconnects
  });

  beforeEach(async () => {
    // The global beforeEach in setup.ts clears tables.
    // Add specific resets for auth tests if needed.
  });

  describe('User Registration API - POST /api/auth/register', () => {
    it('should register a new user successfully and return user data (without password) and set auth cookie', async () => {
      const uniqueEmail = `testuser_${Date.now()}@example.com`;
      const userData = {
        name: 'Test User',
        email: uniqueEmail,
        password: 'Password123!',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      console.log(response.body);
      expect(response.status).toBe(201); // Assuming 201 Created for successful registration
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.id).toEqual(expect.any(String)); // Or number, depending on your ID type
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.password).toBeUndefined(); // Password should NOT be returned
      expect(response.body.data.token).toBeDefined(); // Check that token is returned in response body
      expect(typeof response.body.data.token).toBe('string'); // Token should be a string

      // Check for HTTP-only cookie (e.g., 'token' or 'connect.sid')
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();

      // Ensure setCookieHeader is an array for consistent processing
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader as string];

      expect(cookiesArray.some((cookie: string) => cookie.startsWith('token='))).toBe(true); // Adjust 'token=' if your cookie name is different
      expect(cookiesArray.some((cookie: string) => cookie.includes('HttpOnly'))).toBe(true);

      // Verify user in database
      const dbUser = await prismaTest.user.findUnique({
        where: { email: userData.email },
      });
      expect(dbUser).not.toBeNull();
      expect(dbUser?.email).toBe(userData.email);
      expect(dbUser?.name).toBe(userData.name);
      expect(dbUser?.password).toBeDefined();
      expect(dbUser?.password).not.toBe(userData.password); // Password in DB should be hashed
    });

    it('should return 409 if email already exists', async () => {
      // Test implementation
    });

    it('should return 400 for invalid input (e.g., missing fields, invalid email, weak password)', async () => {
      // Test implementation
    });
  });

  describe('User Login API - POST /api/auth/login', () => {
    let testUser = {
      email: '',
      password: 'Password123!',
      name: 'Login Test User'
    };
    
    // Create a test user before login tests
    beforeAll(async () => {
      // Use a timestamp to ensure unique email
      const timestamp = Date.now();
      testUser.email = `login_test_${timestamp}@example.com`;
      
      console.log(`Creating test user with email: ${testUser.email}`);
      
      // Create the test user using the signup route
      const userData = {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password
      };
      
      // Register the user through the API
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      
      // Verify the user exists in the database
      const user = await prismaTest.user.findUnique({
        where: { email: testUser.email },
      });
      
      console.log(`User created:`, user ? 'Yes' : 'No');
      expect(user).not.toBeNull();
    });

    it('should log in an existing user successfully and return user data and token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
      expect(response.body.data.user.password).toBeUndefined(); // Password should NOT be returned
      expect(response.body.data.token).toBeDefined(); // Token should be in the response
      expect(typeof response.body.data.token).toBe('string');

      // Check for HTTP-only cookie
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      
      const cookiesArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader as string];
      expect(cookiesArray.some((cookie: string) => cookie.startsWith('token='))).toBe(true);
      expect(cookiesArray.some((cookie: string) => cookie.includes('HttpOnly'))).toBe(true);
    });

    it('should return 401 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 404 if user email does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 for invalid input (e.g., missing email or password)', async () => {
      // Test missing email
      const responseNoEmail = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Password123!',
        });

      expect(responseNoEmail.status).toBe(400);
      expect(responseNoEmail.body.success).toBe(false);

      // Test missing password
      const responseNoPassword = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
        });

      expect(responseNoPassword.status).toBe(400);
      expect(responseNoPassword.body.success).toBe(false);
    });
  });

  describe('Get User Profile API - GET /api/auth/profile', () => {
    let testUser = {
      id: '',
      email: '',
      password: 'Password123!',
      name: 'Profile Test User'
    };
    let authToken = '';
    // Initialize cookies for profile test (will be set from login response)
    let cookies: string[] | string = [];

    // Create a test user and get auth token before profile tests
    beforeAll(async () => {
      // Use a timestamp to ensure unique email
      const timestamp = Date.now();
      testUser.email = `profile_test_${timestamp}@example.com`;
      
      console.log(`Creating profile test user with email: ${testUser.email}`);
      
      // Create the test user using the signup route
      const userData = {
        name: testUser.name,
        email: testUser.email,
        password: testUser.password
      };
      
      // Register the user through the API
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData);
      
      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user).toBeDefined();
      
      // Save the user ID and token from the response
      testUser.id = registerResponse.body.data.user.id;
      authToken = registerResponse.body.data.token;
      
      // Get the cookies from the response
      const setCookieHeader = registerResponse.headers['set-cookie'];
      if (setCookieHeader) {
        cookies = setCookieHeader;
      }
      
      console.log(`Profile test user created with ID: ${testUser.id}`);
      console.log(`Token obtained from registration response`);
    });

    it('should return user profile for an authenticated user', async () => {
      // Try with both authorization header and cookies to ensure one works
      let req = request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);
        
      // Only set cookies if they exist
      if (cookies) {
        // Handle both string and string[] cases
        if (Array.isArray(cookies)) {
          req = req.set('Cookie', cookies);
        } else {
          req = req.set('Cookie', [cookies]);
        }
      }
      
      const response = await req;

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testUser.id);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.name).toBe(testUser.name);
      expect(response.body.data.password).toBeUndefined(); // Password should NOT be returned
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 401 if token is invalid or expired', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalid_token_here');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('User Logout API - POST /api/auth/logout', () => {
    it('should log out an authenticated user successfully and clear cookie', async () => {
      // First login to get a token cookie
      const loginEmail = `logout_test_${Date.now()}@example.com`;
      
      // Register a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Logout Test User',
          email: loginEmail,
          password: 'Password123!',
        });
      
      // Login to get cookies
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginEmail,
          password: 'Password123!',
        });
      
      // Get the cookie from the login response
      const cookies = loginResponse.headers['set-cookie'];
      
      // Now logout with the cookie
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);
      
      expect(logoutResponse.status).toBe(200);
      expect(logoutResponse.body.success).toBe(true);
      
      // Check that the token cookie is cleared
      const clearCookieHeader = logoutResponse.headers['set-cookie'];
      expect(clearCookieHeader).toBeDefined();
      
      const cookiesArray = Array.isArray(clearCookieHeader) ? clearCookieHeader : [clearCookieHeader as string];
      expect(cookiesArray.some((cookie: string) => cookie.includes('token=;'))).toBe(true);
    });

    it('should return 200 even if called without an active session (idempotent)', async () => {
      const response = await request(app)
        .post('/api/auth/logout');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  // Add more describe blocks for other auth functionalities if needed
  // e.g., password reset, email verification, etc.
});
