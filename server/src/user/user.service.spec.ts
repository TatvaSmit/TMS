import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashed_password',
        firstname: 'Test',
        lastname: 'User',
      };
      const createdUser = {
        _id: 'user_id',
        ...userData,
      };

      service.create = jest.fn().mockResolvedValue(createdUser);

      const result = await service.create(userData);

      expect(result).toEqual(createdUser);
      expect(service.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('findByEmail', () => {
    it('should find and return a user by email', async () => {
      const email = 'test@example.com';
      const user = {
        _id: 'user_id',
        email,
        firstname: 'Test',
        lastname: 'User',
      };

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      const result = await service.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';

      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await service.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

});
