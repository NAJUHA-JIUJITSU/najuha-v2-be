import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import typia from 'typia';

import { ExpectedError } from '../../src/common/response/errorResponse';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UserEntity } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';

describe('Mockist TEST UsersService (Mockist)', () => {
  let service: UsersService;

  beforeEach(async () => {
    const mockUserData: UserEntity[] = [];

    const mockUserRepository = {
      create: jest.fn().mockImplementation((dto) => ({
        ...dto,
        id: mockUserData.length + 1,
        role: dto.role || 'TEMPORARY_USER',
        status: dto.status || 'ACTIVE',
        nickname: dto.nickname || null,
        belt: dto.belt || null,
        weight: dto.weight || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      save: jest.fn().mockImplementation((user) => {
        const savedUser: UserEntity = {
          ...user,
        };
        mockUserData.push(savedUser);
        return savedUser;
      }),
      findOne: jest.fn().mockImplementation((options) => {
        const { id, snsId, snsProvider } = options.where;
        let result: UserEntity | undefined;

        if (id) {
          result = mockUserData.find((user) => user.id === id);
        } else if (snsId && snsProvider) {
          result = mockUserData.find(
            (user) => user.snsId === snsId && user.snsProvider === snsProvider,
          );
        }

        // 요소를 찾지 못했으면 null 반환
        return result !== undefined ? result : null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await service.createUser(createUserDto);

      const ret = typia.validate<UserEntity>(createdUser);
      expect(ret.success).toBeTruthy();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await service.createUser(createUserDto);

      const updateUserDto = {
        ...createUserDto,
        name: 'Updated Name',
      };

      const updatedUser = await service.updateUser(
        createdUser.id,
        updateUserDto,
      );

      expect(updatedUser).toBeDefined();
      expect(updatedUser.name).toEqual(updateUserDto.name);
    });

    it('should throw an error if user not found', async () => {
      const updateUserDto = {
        name: 'Updated Name',
      };

      try {
        await service.updateUser(999999999, updateUserDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual(new ExpectedError('NOT_FOUND_USER'));
      }
    });
  });

  describe('findUserBySnsIdAndProvider', () => {
    it('should find a user by snsId and snsProvider', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await service.createUser(createUserDto);

      const foundUser = await service.findUserBySnsIdAndProvider(
        createdUser.snsId,
        createdUser.snsProvider,
      );

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toEqual(createdUser.id);
    });

    it('should return null if user not found', async () => {
      const foundUser = await service.findUserBySnsIdAndProvider(
        'not found',
        'KAKAO',
      );

      expect(foundUser).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await service.createUser(createUserDto);

      const foundUser = await service.findUserById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toEqual(createdUser.id);
    });
    it('should return null if user not found', async () => {
      const foundUser = await service.findUserById(99999999);

      expect(foundUser).toBeNull();
    });
  });
});
