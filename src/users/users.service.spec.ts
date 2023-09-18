import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'user1',
          email: 'user1@example.com',
          phone: '1234567890',
          createdAt: new Date(),
        },
        {
          id: 2,
          username: 'user2',
          email: 'user2@example.com',
          phone: '9876543210',
          createdAt: new Date(),
        },
      ];

      userRepository.find = jest.fn().mockResolvedValue(mockUsers);

      const result = await service.getUsers();

      expect(result).toEqual(mockUsers);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        phone: '1234567890',
      };

      const newUser: Partial<User> = {
        id: 1,
        createdAt: new Date(),
        ...createUserDto,
      };

      userRepository.create = jest.fn().mockReturnValue(newUser);
      userRepository.save = jest.fn().mockResolvedValue(newUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(newUser);
    });
  });
});
