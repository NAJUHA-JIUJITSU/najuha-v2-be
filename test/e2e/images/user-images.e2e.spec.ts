import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import typia from 'typia';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import appEnv from '../../../src/common/app-env';
import { ResponseForm } from '../../../src/common/response/response';
import { DataSource, EntityManager } from 'typeorm';
import { UsersAppService } from '../../../src/modules/users/application/users.app.service';
import { JwtService } from '@nestjs/jwt';
import { Redis } from 'ioredis';
import { ImageAppService } from '../../../src/modules/images/application/image.app.service';
import { CreateImageReqBody, CreateImageRes } from '../../../src/modules/images/presentation/images.controller.dto';
import * as FormData from 'form-data';
import axios from 'axios';
import * as sharp from 'sharp';
import { UserDummyBuilder } from '../../../src/dummy/user-dummy';
import { UserEntity } from '../../../src/database/entity/user/user.entity';

describe('E2E u-9 user-images test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersAppService;
  let imageAppService: ImageAppService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    dataSource = testingModule.get<DataSource>(DataSource);
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    userService = testingModule.get<UsersAppService>(UsersAppService);
    imageAppService = testingModule.get<ImageAppService>(ImageAppService);

    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-9-1 POST /user/images --------------------------------------------------', () => {
    it('imageEntity 생성 및 presignedPost 반환 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const body: CreateImageReqBody = {
        format: 'image/jpeg',
        path: 'user-profile',
      };

      /** main test. */
      const res = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(typia.is<ResponseForm<CreateImageRes>>(res.body)).toBe(true);
    });

    it('imageEntity 생성 및 presignedPost 반환 성공 + bucket에 이미지 업로드 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const body: CreateImageReqBody = {
        format: 'image/jpeg',
        path: 'user-profile',
      };

      /** main test. */
      const res = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(typia.is<ResponseForm<CreateImageRes>>(res.body)).toBe(true);
      const typedBody = res.body as ResponseForm<CreateImageRes>;

      const { image, presignedPost } = typedBody.result;
      const { url, fields } = presignedPost;

      // Create dummy image using sharp 5Mb
      const buffer = await sharp({
        create: {
          width: 5000,
          height: 5000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', buffer, { filename: 'test.jpg', contentType: 'image/jpeg' });

      const uploadRes = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      expect(uploadRes.status).toBe(204);
    });

    it('imageEntity 생성 및 presignedPost 반환 성공 + bucket에 이미지 업로드 실패 시 (5MB 초과 이미지)', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const body: CreateImageReqBody = {
        format: 'image/jpeg',
        path: 'user-profile',
      };

      /** main test. */
      const res = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);

      expect(typia.is<ResponseForm<CreateImageRes>>(res.body)).toBe(true);
      const typedBody = res.body as ResponseForm<CreateImageRes>;

      const { image, presignedPost } = typedBody.result;
      const { url, fields } = presignedPost;

      // Create dummy image larger than 6MB
      const buffer = await sharp({
        create: {
          width: 6000,
          height: 6000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', buffer, { filename: 'test-7mb.jpg', contentType: 'image/jpeg' });

      try {
        await axios.post(url, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });
});
