import { UserService } from './UserService';
import prismaClient from '../prisma';
import { User } from '@prisma/client';

// Explicitly mock all Prisma user methods as jest.fn()
jest.mock('../prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

// Cast prismaClient to the correct mocked type
const mockPrismaClient = prismaClient as unknown as {
  user: {
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const mockUsers: User[] = [
  { id: '1', username: 'user1', email: 'user1@test.com', name: 'User One', password: 'hash1', createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', updatedBy: 'admin' },
  { id: '2', username: 'user2', email: 'user2@test.com', name: 'User Two', password: 'hash2', createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', updatedBy: 'admin' },
];


describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users successfully', async () => {

      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const result = await userService.getAllUsers();

      expect(result).toEqual({ ok: true, users: mockUsers });
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData: Partial<User> = {
        username: 'newuser',
        email: 'new@test.com',
        name: 'New User',
        password: 'password123',
      };
      const createdBy = 'admin';
      const mockCreatedUser = { id: '3', ...userData } as User;

      mockPrismaClient.user.create.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(userData, createdBy);

      expect(result).toEqual(mockCreatedUser);
      expect(mockPrismaClient.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          username: userData.username,
          email: userData.email,
          name: userData.name,
          password: userData.password,
          createdBy,
          updatedBy: createdBy,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const userId = '1';
      const updateData: Partial<User> = {
        username: 'updateduser',
        email: 'updated@test.com',
      };
      const updatedBy = 'admin';
      const mockUpdatedUser = { id: userId, ...updateData } as User;

      mockPrismaClient.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(userId, updateData, updatedBy);

      expect(result).toEqual(mockUpdatedUser);
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: expect.objectContaining({
          username: updateData.username,
          email: updateData.email,
          updatedBy,
          updatedAt: expect.any(String),
        }),
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const userId = '1';
      const mockDeletedUser = { id: userId } as User;

      mockPrismaClient.user.delete.mockResolvedValue(mockDeletedUser);

      const result = await userService.deleteUser(userId);

      expect(result).toEqual(mockDeletedUser);
      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('searchUserByEmail', () => {
    it('should search users by email successfully', async () => {
      const email = 'test';
      const mockUsers: User[] = [
        { id: '1', username: 'user1', email: 'test@example.com', name: 'Test User', password: 'hash', createdAt: new Date(), updatedAt: new Date(), createdBy: 'admin', updatedBy: 'admin' },
      ];

      mockPrismaClient.user.findMany.mockResolvedValue(mockUsers);

      const result = await userService.searchUserByEmail(email);

      expect(result).toEqual(mockUsers);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
        where: {
          email: {
            contains: email,
            mode: 'insensitive',
          },
        },
      });
    });

    it('should return empty array when no users match email search', async () => {
      const email = 'nonexistent';
      mockPrismaClient.user.findMany.mockResolvedValue([]);

      const result = await userService.searchUserByEmail(email);

      expect(result).toEqual([]);
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledTimes(1);
    });
  });

  

  describe('searchUserByUsername', () => {
    it('should search user by username successfully', async () => {
      const username = 'user1';
      mockPrismaClient.user.findMany.mockResolvedValue({...mockUsers[0]});

      const result = await userService.searchUserByUserName(username);


      expect(result).toEqual({...mockUsers[0]});
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      });
    });
  });

});
