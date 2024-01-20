import typia from 'typia';
import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
import { CreateUserDto } from '../../src/users/dto/create-user.dto';
import { UserEntity } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';
// import { typeOrmConfigAsync } from '../src/typeorm.config';
import { DataSource } from 'typeorm';
import { ExpectedError } from '../../src/response/errorResponse';
import { AppModule } from '../../src/app.module';

describe('Classicist TEST UsersService', () => {
  let module: TestingModule;
  let dataSource: DataSource;
  let usersService: UsersService;

  // beforeAll(async () => {
  //   module = await Test.createTestingModule({
  //     imports: [
  //       ConfigModule.forRoot({
  //         isGlobal: true,
  //         envFilePath: `.env.${process.env.NODE_ENV}`,
  //       }),
  //       TypeOrmModule.forRootAsync(typeOrmConfigAsync),
  //       TypeOrmModule.forFeature([UserEntity]),
  //     ],
  //     providers: [UsersService],
  //   }).compile();
  //   dataSource = module.get<DataSource>(DataSource);
  //   service = module.get<UsersService>(UsersService);
  // });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    dataSource = module.get<DataSource>(DataSource);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = dataSource.getRepository(entity.name);
      await repository.clear();
    }
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await usersService.createUser(createUserDto);
      const ret = typia.validate<UserEntity>(createdUser);
      expect(ret.success).toBeTruthy();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await usersService.createUser(createUserDto);

      const updateUserDto = {
        ...createUserDto,
        name: 'Updated Name',
      };

      const updatedUser = await usersService.updateUser(
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
        await usersService.updateUser(999999999, updateUserDto);
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toEqual(new ExpectedError('NOT_FOUND_USER'));
      }
    });
  });

  describe('findUserBySnsIdAndProvider', () => {
    it('should find a user by snsId and snsProvider', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await usersService.createUser(createUserDto);

      const foundUser = await usersService.findUserBySnsIdAndProvider(
        createdUser.snsId,
        createdUser.snsProvider,
      );

      expect(foundUser).toBeDefined();
      expect(foundUser!.snsId).toEqual(createdUser.snsId);
      expect(foundUser!.snsProvider).toEqual(createdUser.snsProvider);
    });

    it('should return null if user not found', async () => {
      const foundUser = await usersService.findUserBySnsIdAndProvider(
        'not-exist-sns-id',
        'KAKAO',
      );

      expect(foundUser).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find a user by id', async () => {
      const createUserDto = typia.random<CreateUserDto>();
      const createdUser = await usersService.createUser(createUserDto);

      const foundUser = await usersService.findUserById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser!.id).toEqual(createdUser.id);
    });

    it('should return null if user not found', async () => {
      const foundUser = await usersService.findUserById(999999999);

      expect(foundUser).toBeNull();
    });
  });
});
