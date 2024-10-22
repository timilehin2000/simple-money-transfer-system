// import { DataSource } from 'typeorm';
// import request from 'supertest';
// import app from '../src/app';
// import { hash } from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { User, Wallet } from '../src/entities';

// const AppDataSource = new DataSource({
//     type: 'postgres',
//     database: 'test_db',
//     entities: [User, Wallet],
//     synchronize: true,
//     dropSchema: true,
// });

// jest.mock('jsonwebtoken');

// describe('Banking API Tests with JWT Mock', () => {
//     let dataSource: DataSource;
//     let authToken: string;
//     let testUserId: string;

//     beforeAll(async () => {
//         dataSource = AppDataSource;
//         await dataSource.initialize();

//         // Clear database
//         await dataSource.dropDatabase();
//         await dataSource.synchronize();

//         // Create test user
//         const userRepository = dataSource.getRepository(User);
//         const walletRepository = dataSource.getRepository(Wallet);

//         const hashedPassword = await hash('testpass123', 10);
//         const user = await userRepository.save({
//             username: 'testuser',
//             email: 'test@example.com',
//             password: hashedPassword,
//             firstName: 'Test',
//             lastName: 'User',
//         });

//         // Create wallet for test user
//         await walletRepository.save({
//             user: user,
//             balance: 1000.0,
//         });

//         testUserId = user.id;

//         // Mock JWT sign function to return a static token
//         (jwt.sign as jest.Mock).mockReturnValue('mocked-jwt-token');

//         // Use the mocked token in tests
//         authToken = 'mocked-jwt-token';
//     });

//     describe('POST /users', () => {
//         it('should create a new user and wallet successfully', async () => {
//             const response = await request(app).post('api/v1/users').send({
//                 username: 'Timmy',
//                 password: 'password123#',
//                 email: 'test@example.com',
//                 firstName: 'Timi',
//                 lastName: 'Abodunrin',
//             });

//             expect(response.status).toBe(201);
//             expect(response.body).toHaveProperty('id');
//             expect(response.body.username).toBe('timmy');
//             expect(response.body).toHaveProperty('token');
//             expect(response.body.token).toBe('mocked-jwt-token');
//             expect(response.body).not.toHaveProperty('password');

//             const userRepository = dataSource.getRepository(User);
//             const walletRepository = dataSource.getRepository(Wallet);

//             const savedUser = await userRepository.findOne({
//                 where: { username: 'newuser' },
//                 relations: ['wallet'],
//             });

//             expect(savedUser).toBeTruthy();
//             expect(savedUser!.wallet).toBeTruthy();
//             expect(savedUser!.wallet.balance).toBe(1000.0); // Default wallet balance
//         });

//         // it('should handle username already exists', async () => {
//         //     const response = await request(app).post('/users').send({
//         //         username: 'testuser', // existing username
//         //         password: 'password123',
//         //         email: 'another@example.com',
//         //         firstName: 'Another',
//         //         lastName: 'User',
//         //     });

//         //     expect(response.status).toBe(400);
//         //     expect(response.body.message).toBe('Username already exists');
//         // });
//     });

//     // describe('GET /users/:id', () => {
//     //     it('should get user details with balance', async () => {
//     //         // Mock JWT verify function to return a decoded token object
//     //         (jwt.verify as jest.Mock).mockReturnValue({
//     //             id: testUserId,
//     //             username: 'testuser',
//     //         });

//     //         const response = await request(app)
//     //             .get(`/users/${testUserId}`)
//     //             .set('Authorization', `Bearer ${authToken}`);

//     //         expect(response.status).toBe(200);
//     //         expect(response.body.username).toBe('testuser');
//     //         expect(response.body).toHaveProperty('balance');
//     //         expect(response.body.balance).toBe(1000.0);
//     //         expect(response.body).not.toHaveProperty('password');
//     //     });

//     //     it('should return 404 for non-existent user', async () => {
//     //         (jwt.verify as jest.Mock).mockReturnValue({
//     //             id: 'nonexistent-id',
//     //             username: 'testuser',
//     //         });

//     //         const response = await request(app)
//     //             .get('/users/nonexistent-id')
//     //             .set('Authorization', `Bearer ${authToken}`);

//     //         expect(response.status).toBe(404);
//     //     });
//     // });
// });
