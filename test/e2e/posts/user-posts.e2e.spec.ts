import { INestApplication, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { EntityManager } from 'typeorm';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import appEnv from '../../../src/common/app-env';
import { UserDummyBuilder } from '../../../src/dummy/user-dummy';
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import {
  CreatePostReqBody,
  CreatePostRes,
  FindPostsRes,
} from '../../../src/modules/posts/presentation/posts.controller.dto';
import { ResponseForm } from '../../../src/common/response/response';
import typia from 'typia';
import axios from 'axios';
import * as sharp from 'sharp';
import * as FormData from 'form-data';

describe('E2E u-7 competitions TEST', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-7-1 POST /user/posts', () => {
    it('게시물 생성 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const postCreateDto: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const res = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      expect(typia.is<ResponseForm<CreatePostRes>>(res.body)).toBe(true);
    });

    it('게시물 + 이미지 생성 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const creatImageRes = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'post' });
      const { image, presignedPost } = creatImageRes.body.result;
      const { url, fields } = presignedPost;
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
      const postCreateDto: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
        imageIds: [image.id],
      };
      const res = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      expect(typia.is<ResponseForm<CreatePostRes>>(res.body)).toBe(true);
    });
  });

  describe('u-7-2 GET /user/posts', () => {
    it('게시물 조회 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateDto: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      /** main test. */
      const res = await request(app.getHttpServer()).get('/user/posts').set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<FindPostsRes>>(res.body)).toBe(true);
    });
  });
});
