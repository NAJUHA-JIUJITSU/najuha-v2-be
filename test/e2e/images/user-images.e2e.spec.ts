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
import {
  CreateImageReqBody,
  CreateImageRes,
  CreateUserProfileImagePresignedPostReqBody,
  CreateUserProfileImagePresignedPostRes,
} from '../../../src/modules/images/presentation/images.controller.dto';
import * as FormData from 'form-data';
import axios from 'axios';
import { UserDummyBuilder } from '../../../src/dummy/user-dummy';
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import * as fs from 'fs/promises';

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
  let dummy5MbImageBuffer: Buffer;
  let dummy6MbImageBuffer: Buffer;

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
    dummy5MbImageBuffer = await fs.readFile('test/resources/test-4.5mb.jpg');
    dummy6MbImageBuffer = await fs.readFile('test/resources/test-6.5mb.jpg');

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
        path: 'post',
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
        path: 'post',
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
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
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
        path: 'post',
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
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', dummy6MbImageBuffer, { filename: 'test-7mb.jpg', contentType: 'image/jpeg' });
      try {
        const res = await axios.post(url, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        });
        expect(true).toBe(false); // 이 코드가 실행되면 테스트 실패
      } catch (error: any) {
        expect(error.response.status).toBe(400);
      }
    });
  });

  describe('u-9-2 createUserProfileImagePresignedPost Post /user/images/user-profile --', () => {
    it('userProfileImagePresignedPost 반환 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const body: CreateUserProfileImagePresignedPostReqBody = {
        format: 'image/jpeg',
      };
      /** main test. */
      const res = await request(app.getHttpServer())
        .post('/user/images/user-profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);
      expect(typia.is<ResponseForm<CreateUserProfileImagePresignedPostRes>>(res.body)).toBe(true);
    });

    it('userProfileImagePresignedPost 반환 성공 + bucket에 이미지 업로드 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const body: CreateUserProfileImagePresignedPostReqBody = {
        format: 'image/jpeg',
      };
      /** main test. */
      const res = await request(app.getHttpServer())
        .post('/user/images/user-profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);
      expect(typia.is<ResponseForm<CreateUserProfileImagePresignedPostRes>>(res.body)).toBe(true);
      const typedBody = res.body as ResponseForm<CreateUserProfileImagePresignedPostRes>;
      const { presignedPost } = typedBody.result;
      const { url, fields } = presignedPost;
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
      const uploadRes = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      expect(uploadRes.status).toBe(204);
    });

    it('userProfileImagePresignedPost 반환 성공 + bucket에 이미지 업로드 성공 후 이미지 삭제 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const body: CreateUserProfileImagePresignedPostReqBody = {
        format: 'image/jpeg',
      };
      /** main test. */
      const res = await request(app.getHttpServer())
        .post('/user/images/user-profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(body);
      expect(typia.is<ResponseForm<CreateUserProfileImagePresignedPostRes>>(res.body)).toBe(true);
      const typedBody = res.body as ResponseForm<CreateUserProfileImagePresignedPostRes>;
      const { presignedPost } = typedBody.result;
      const { url, fields } = presignedPost;
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
      const uploadRes = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      expect(uploadRes.status).toBe(204);
      const deleteRes = await request(app.getHttpServer())
        .delete('/user/images/user-profile')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<void>>(deleteRes.body)).toBe(true);
    });
  });
});
