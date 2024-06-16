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
  CreatePostReportReqBody,
  CreatePostReqBody,
  CreatePostRes,
  FindPostsRes,
  GetPostRes,
  UpdatePostReqBody,
  UpdatePostRes,
} from '../../../src/modules/posts/presentation/posts.controller.dto';
import { ResponseForm } from '../../../src/common/response/response';
import typia from 'typia';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs/promises';
import {
  ENTITY_NOT_FOUND,
  POSTS_POST_LIKE_ALREADY_EXIST,
  POSTS_POST_REPORT_ALREADY_EXIST,
} from '../../../src/common/response/errorResponse';
import { IUser } from '../../../src/modules/users/domain/interface/user.interface';

describe('E2E u-7 competitions TEST', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let dummy5MbImageBuffer: Buffer;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication();
    entityEntityManager = testingModule.get<EntityManager>(EntityManager);
    tableNames = entityEntityManager.connection.entityMetadatas.map((entity) => `"${entity.tableName}"`).join(', ');
    redisClient = testingModule.get<Redis>('REDIS_CLIENT');
    jwtService = testingModule.get<JwtService>(JwtService);
    dummy5MbImageBuffer = await fs.readFile('test/resources/test-4.5mb.jpg');
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

  describe('u-7-3 GET /user/posts/:postId', () => {
    it('특정 게시물 조회 성공 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      /** main test. */
      const res = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<CreatePostRes>>(res.body)).toBe(true);
    });
  });

  describe('u-7-4 PATCH /user/posts/:postId', () => {
    it('게시물 수정 성공 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      /** main test. */
      const postUpdateDto: UpdatePostReqBody = {
        title: 'title',
        body: 'body',
      };
      const res = await request(app.getHttpServer())
        .patch(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postUpdateDto);
      expect(typia.is<ResponseForm<UpdatePostRes>>(res.body)).toBe(true);
    });
  });

  describe('u-7-5 DELETE /user/posts/:postId', () => {
    it('게시물 삭제 성공 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      /** main test. */
      await request(app.getHttpServer()).delete(`/user/posts/${postId}`).set('Authorization', `Bearer ${accessToken}`);
      const res = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ENTITY_NOT_FOUND>(res.body)).toBe(true);
    });
  });

  describe('u-7-6 POST /user/posts/:postId/like', () => {
    it('게시물 좋아요 성공 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      /** main test. */
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      const post = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<GetPostRes>>(post.body)).toBe(true);
      expect(post.body.result.post.userLiked).toBe(true);
    });

    it('게시물 중복 좋아요 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      /** main test. */
      const res = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<POSTS_POST_LIKE_ALREADY_EXIST>(res.body)).toBe(true);
    });
  });

  describe('u-7-7 DELETE /user/posts/:postId/like', () => {
    it('게시물 좋아요 취소 성공 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      const post = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<GetPostRes>>(post.body)).toBe(true);
      expect(post.body.result.post.userLiked).toBe(false);
    });
  });

  describe('u-7-8 POST /user/posts/:postId/report', () => {
    it('게시물 신고 성공 시 (10명 이상 신고시 게시물 INACTIVE 처리)', async () => {
      /** pre condition. */
      let users: IUser[] = [];
      for (let i = 0; i < 10; i++) {
        const user = new UserDummyBuilder().setNickname(`user${i}`).build();
        await entityEntityManager.save(UserEntity, user);
        users.push(user);
      }
      const accessTokens = users.map((user) =>
        jwtService.sign(
          { userId: user.id, userRole: user.role },
          { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
        ),
      );
      const postCreateDto: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      /** main test. */
      const postReport: CreatePostReportReqBody = {
        type: 'SPAM',
        reason: 'reason',
      };
      for (const accessToken of accessTokens) {
        const res = await request(app.getHttpServer())
          .post(`/user/posts/${postId}/report`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(postReport);
        expect(typia.is<ResponseForm<void>>(res.body)).toBe(true);
      }
      const res = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessTokens[0]}`);
      expect(typia.is<ENTITY_NOT_FOUND>(res.body)).toBe(true);
    });

    it('게시물 중복 신고 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      const postReport: CreatePostReportReqBody = {
        type: 'SPAM',
        reason: 'reason',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport);
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport);
      /** main test. */
      const res = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport);
      expect(typia.is<POSTS_POST_REPORT_ALREADY_EXIST>(res.body)).toBe(true);
    });
  });

  describe('u-7-9 DELETE /user/posts/:postId/report', () => {
    it('게시물 신고 취소 성공 시', async () => {
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
      const createPostRes = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateDto);
      const postId = createPostRes.body.result.post.id;
      const postReport: CreatePostReportReqBody = {
        type: 'SPAM',
        reason: 'reason',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport);
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport);
      /** main test. */
      // 신고 취소 후 다시 신고되는 테스트
      await request(app.getHttpServer())
        .delete(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`);
      const ret = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport);
      expect(typia.is<ResponseForm<void>>(ret.body)).toBe(true);
    });
  });
});
