import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Redis } from 'ioredis';
import { EntityManager } from 'typeorm';
import { AppModule } from '../../../src/app.module';
import * as request from 'supertest';
import appEnv from '../../../src/common/app-env';
import { UserDummyBuilder } from '../../../src/dummy/user.dummy';
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import {
  CreateCommentReplyReqBody,
  CreateCommentReplyRes,
  CreateCommentReportReqBody,
  CreateCommentReqBody,
  CreateCommentRes,
  CreatePostReportReqBody,
  CreatePostReqBody,
  CreatePostRes,
  FindBestCommentsRes,
  FindCommentsRes,
  FindPostsRes,
  GetPostRes,
  UpdateCommentReqBody,
  UpdateCommentRes,
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
  POSTS_COMMENT_LIKE_ALREADY_EXIST,
  POSTS_COMMENT_REPORT_ALREADY_EXIST,
  POSTS_POST_LIKE_ALREADY_EXIST,
  POSTS_POST_REPORT_ALREADY_EXIST,
} from '../../../src/common/response/errorResponse';
import { IUser } from '../../../src/modules/users/domain/interface/user.interface';
import { CreateImageRes } from '../../../src/modules/images/presentation/images.controller.dto';
import { ICommentDetail } from '../../../src/modules/posts/domain/interface/comment.interface';

describe('E2E u-7 Post TEST', () => {
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
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
      const createImageResBody = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'post' })
        .then((res) => {
          return typia.assert<ResponseForm<CreateImageRes>>(res.body);
        });

      const { image, presignedPost } = createImageResBody.result;
      const { url, fields } = presignedPost;
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
      const uploadResBody = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      expect(uploadResBody.status).toBe(204);

      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
        imageIds: [image.id],
      };
      const createPostWithImageResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      /** main test. */
      const findPostsResBody = await request(app.getHttpServer())
        .get('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindPostsRes>>(res.body);
        });
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      /** main test. */
      const getPostResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<GetPostRes>>(res.body);
        });
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      /** main test. */
      const postUpdateReqBody: UpdatePostReqBody = {
        title: 'title',
        body: 'body',
      };
      const updatePostResBody = await request(app.getHttpServer())
        .patch(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postUpdateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<UpdatePostRes>>(res.body);
        });
    });

    it('게시물 + 내용수정, 기존이미지 유지 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      const createImageResBody = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'post' })
        .then((res) => {
          return typia.assert<ResponseForm<CreateImageRes>>(res.body);
        });

      const { image, presignedPost } = createImageResBody.result;
      const { url, fields } = presignedPost;
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
      const uploadResBody = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      expect(uploadResBody.status).toBe(204);

      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
        imageIds: [image.id],
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });

      const post = createPostResBody.result.post;
      const latestPostSnapshot = post.postSnapshots[post.postSnapshots.length - 1];
      const imageIds = latestPostSnapshot.postSnapshotImages.map((image) => image.image.id);

      /** main test. */
      const postUpdateReqBody: UpdatePostReqBody = {
        title: 'updated title',
        body: 'updated body',
        imageIds: [...imageIds],
      };
      const updatePostWithImagesResBody = await request(app.getHttpServer())
        .patch(`/user/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postUpdateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<UpdatePostRes>>(res.body);
        });
      expect(updatePostWithImagesResBody.result.post.postSnapshots.length).toBe(2);
      expect(updatePostWithImagesResBody.result.post.postSnapshots[1].title).toBe('updated title');
      expect(updatePostWithImagesResBody.result.post.postSnapshots[1].body).toBe('updated body');
      expect(updatePostWithImagesResBody.result.post.postSnapshots[1].postSnapshotImages[0].image.id).toBe(imageIds[0]);
    });

    it('게시물 + 새로운 이미지로 수정 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );

      // First image creation and upload
      const createImageResBody1 = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'post' })
        .then((res) => {
          return typia.assert<ResponseForm<CreateImageRes>>(res.body);
        });
      const formData1 = new FormData();
      const { image: image1, presignedPost: presignedPost1 } = createImageResBody1.result;
      Object.entries(presignedPost1.fields).forEach(([key, value]) => {
        formData1.append(key, value as string);
      });
      formData1.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
      const uploadResBody1 = await axios.post(presignedPost1.url, formData1, {
        headers: {
          ...formData1.getHeaders(),
        },
      });
      expect(uploadResBody1.status).toBe(204);

      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
        imageIds: [image1.id],
      };
      const createPostResBody1 = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody1.result.post.id;

      /** main test. */
      // Second image creation and upload
      const createImageResBody2 = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'post' })
        .then((res) => {
          return typia.assert<ResponseForm<CreateImageRes>>(res.body);
        });
      const formData2 = new FormData();
      const { image: image2, presignedPost: presignedPost2 } = createImageResBody2.result;
      Object.entries(presignedPost2.fields).forEach(([key, value]) => {
        formData2.append(key, value as string);
      });
      formData2.append('file', dummy5MbImageBuffer, { filename: 'test.jpg', contentType: 'image/jpeg' });
      const uploadResBody2 = await axios.post(presignedPost2.url, formData2, {
        headers: {
          ...formData2.getHeaders(),
        },
      });
      expect(uploadResBody2.status).toBe(204);

      const postUpdateReqBody: UpdatePostReqBody = {
        title: 'title',
        body: 'body',
        imageIds: [image2.id],
      };
      const updatePostWithNewImageResBody = await request(app.getHttpServer())
        .patch(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postUpdateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<UpdatePostRes>>(res.body);
        });
      expect(updatePostWithNewImageResBody.result.post.postSnapshots.length).toBe(2);
      expect(updatePostWithNewImageResBody.result.post.postSnapshots[1].postSnapshotImages.length).toBe(1);
      expect(updatePostWithNewImageResBody.result.post.postSnapshots[1].postSnapshotImages[0].image.id).toBe(image2.id);
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      /** main test. */
      await request(app.getHttpServer()).delete(`/user/posts/${postId}`).set('Authorization', `Bearer ${accessToken}`);
      const getDeletedPostResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ENTITY_NOT_FOUND>(res.body);
        });
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      /** main test. */
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      const getPostResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<GetPostRes>>(res.body);
        });
      expect(getPostResBody.result.post.userLiked).toBe(true);
    });

    it('게시물 중복 좋아요 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      /** main test. */
      const duplicateLikeResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<POSTS_POST_LIKE_ALREADY_EXIST>(res.body);
        });
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/${postId}/like`)
        .set('Authorization', `Bearer ${accessToken}`);
      const getPostResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<GetPostRes>>(res.body);
        });
      expect(getPostResBody.result.post.userLiked).toBe(false);
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      /** main test. */
      const postReport: CreatePostReportReqBody = {
        type: 'SPAM_CLICKBAIT',
      };
      for (const accessToken of accessTokens) {
        const reportResBody = await request(app.getHttpServer())
          .post(`/user/posts/${postId}/report`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(postReport)
          .then((res) => {
            return typia.assert<ResponseForm<void>>(res.body);
          });
      }
      const getReportedPostResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .then((res) => {
          return typia.assert<ENTITY_NOT_FOUND>(res.body);
        });
    });

    it('게시물 중복 신고 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const postReport: CreatePostReportReqBody = {
        type: 'SPAM_CLICKBAIT',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });

      /** main test. */
      const duplicateReportResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport)
        .then((res) => {
          return typia.assert<POSTS_POST_REPORT_ALREADY_EXIST>(res.body);
        });
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const postReport: CreatePostReportReqBody = {
        type: 'SPAM_CLICKBAIT',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });

      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`);
      const cancelReportResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postReport)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
    });
  });

  describe('u-7-10 Post /user/posts/:postId/comments', () => {
    it('게시물 댓글 생성 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      /** main test. */
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
    });
  });

  describe('u-7-11 Post /user/posts/:postId/comments/:commentId/replies', () => {
    it('게시물 댓글 답글 생성 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      /** main test. */
      const commentReplyCreateReqBody: CreateCommentReplyReqBody = {
        body: 'body',
      };
      const createCommentReplyResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(commentReplyCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentReplyRes>>(res.body);
        });
    });
  });

  describe('u-7-12 GET /user/posts/:postId/comments', () => {
    it('게시물 댓글 조회 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody);
      /** main test. */
      const findCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
    });
  });

  describe('u-7-13 GET /user/posts/:postId/comments/:commentId/replies', () => {
    it('게시물 답글 조회 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      const commentReplyCreateReqBody: CreateCommentReplyReqBody = {
        body: 'body',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(commentReplyCreateReqBody);
      /** main test. */
      const findRepliesResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
    });
  });

  describe('u-7-14 PATCH /user/posts/comments/:commentId', () => {
    it('게시물 댓글 수정 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      /** main test. */
      const commentUpdateReqBody: UpdateCommentReqBody = {
        body: 'body',
      };
      const updateCommentResBody = await request(app.getHttpServer())
        .patch(`/user/posts/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentUpdateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<UpdateCommentRes>>(res.body);
        });
    });

    it('게시물 답글 수정 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      const commentReplyCreateReqBody: CreateCommentReplyReqBody = {
        body: 'body',
      };
      const createCommentReplyResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(commentReplyCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentReplyRes>>(res.body);
        });
      const commentReplyId = createCommentReplyResBody.result.comment.id;
      /** main test. */
      const commentUpdateReqBody: UpdateCommentReqBody = {
        body: 'body',
      };
      const updateReplyResBody = await request(app.getHttpServer())
        .patch(`/user/posts/comments/${commentReplyId}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(commentUpdateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<UpdateCommentRes>>(res.body);
        });
    });
  });

  describe('u-7-15 DELETE /user/posts/comments/:commentId', () => {
    it('게시물 댓글 삭제 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      const findCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
      expect(findCommentsResBody.result.comments.length).toBe(0);
    });

    it('게시물 답글 삭제 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      const commentReplyCreateReqBody: CreateCommentReplyReqBody = {
        body: 'body',
      };
      const createCommentReplyResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .send(commentReplyCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentReplyRes>>(res.body);
        });
      const commentReplyId = createCommentReplyResBody.result.comment.id;
      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/comments/${commentReplyId}`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      const findRepliesResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
      expect(findRepliesResBody.result.comments.length).toBe(0);
    });
  });

  describe('u-7-16 Post /user/posts/comments/:commentId/like', () => {
    it('게시물 댓글 좋아요 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      /** main test. */
      await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/like`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      const findCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
      expect(findCommentsResBody.result.comments[0].userLiked).toBe(true);
    });

    it('게시물 댓글 중복 좋아요 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/like`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      /** main test. */
      const duplicateLikeResBody = await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/like`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<POSTS_COMMENT_LIKE_ALREADY_EXIST>(res.body);
        });
    });
  });

  describe('u-7-17 DELETE /user/posts/comments/:commentId/like', () => {
    it('게시물 댓글 좋아요 취소 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/like`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/comments/${commentId}/like`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      const findCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken2}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
      expect(findCommentsResBody.result.comments[0].userLiked).toBe(false);
    });
  });

  describe('u-7-18 Post /user/posts/comments/:commentId/report', () => {
    it('게시물 댓글 신고 성공 시 (10명 이상 신고시 게시물 INACTIVE 처리)', async () => {
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      /** main test. */
      const commentReport: CreateCommentReportReqBody = {
        type: 'SPAM_CLICKBAIT',
      };
      for (const accessToken of accessTokens) {
        const reportResBody = await request(app.getHttpServer())
          .post(`/user/posts/comments/${commentId}/report`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(commentReport)
          .then((res) => {
            return typia.assert<ResponseForm<void>>(res.body);
          });
      }
      const findCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindCommentsRes>>(res.body);
        });
      expect(findCommentsResBody.result.comments.length).toBe(0);
    });

    it('게시물 댓글 중복 신고 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      const commentReport: CreateCommentReportReqBody = {
        type: 'SPAM_CLICKBAIT',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentReport)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      /** main test. */
      const duplicateReportResBody = await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentReport)
        .then((res) => {
          return typia.assert<POSTS_COMMENT_REPORT_ALREADY_EXIST>(res.body);
        });
    });
  });

  describe('u-7-19 DELETE /user/posts/comments/:commentId/report', () => {
    it('게시물 댓글 신고 취소 성공 시', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const user2 = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user2);
      const accessToken2 = jwtService.sign(
        { userId: user2.id, userRole: user2.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      const commentReport: CreateCommentReportReqBody = {
        type: 'SPAM_CLICKBAIT',
      };
      await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentReport)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      /** main test. */
      await request(app.getHttpServer())
        .delete(`/user/posts/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
      const cancelReportResBody = await request(app.getHttpServer())
        .post(`/user/posts/comments/${commentId}/report`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentReport)
        .then((res) => {
          return typia.assert<ResponseForm<void>>(res.body);
        });
    });
  });

  describe('u-7-20 Get findBestComments /user/posts/best-comments', () => {
    it('게시물 베스트(likeCount 6 이상) 댓글 조회 성공시', async () => {
      /** pre condition. */
      const users: IUser[] = [];
      for (let i = 0; i < 6; i++) {
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      for (let i = 0; i < 6; i++) {
        await request(app.getHttpServer())
          .post(`/user/posts/comments/${commentId}/like`)
          .set('Authorization', `Bearer ${accessTokens[i]}`)
          .then((res) => {
            return typia.assert<ResponseForm<void>>(res.body);
          });
      }

      /** main test. */
      const findBestCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/best-comments`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindBestCommentsRes>>(res.body);
        });
      typia.assert<ICommentDetail>(findBestCommentsResBody.result.comment);
    });

    it('게시물 베스트(likeCount 6 이상) 대댓글 조회 성공시', async () => {
      /** pre condition. */
      const users: IUser[] = [];
      for (let i = 0; i < 6; i++) {
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
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });
      const commentId = createCommentResBody.result.comment.id;
      const createCommentReplyReqBody: CreateCommentReplyReqBody = {
        body: 'body',
      };
      const createCommentReplyResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments/${commentId}/replies`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .send(createCommentReplyReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentReplyRes>>(res.body);
        });
      const commentReplyId = createCommentReplyResBody.result.comment.id;
      for (let i = 0; i < 6; i++) {
        await request(app.getHttpServer())
          .post(`/user/posts/comments/${commentReplyId}/like`)
          .set('Authorization', `Bearer ${accessTokens[i]}`)
          .then((res) => {
            return typia.assert<ResponseForm<void>>(res.body);
          });
      }

      /** main test. */
      const findBestCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/best-comments`)
        .set('Authorization', `Bearer ${accessTokens[0]}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindBestCommentsRes>>(res.body);
        });
      typia.assert<ICommentDetail>(findBestCommentsResBody.result.comment);
    });

    it('게시물 베스트(likeCount 6 이하) 댓글 or 베스트 대댓글 조회시 null 반환 성공', async () => {
      /** pre condition. */
      const user = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, user);
      const accessToken = jwtService.sign(
        { userId: user.id, userRole: user.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const postCreateReqBody: CreatePostReqBody = {
        category: 'COMPETITION',
        title: 'title',
        body: 'body',
      };
      const createPostResBody = await request(app.getHttpServer())
        .post('/user/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(postCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreatePostRes>>(res.body);
        });
      const postId = createPostResBody.result.post.id;
      const commentCreateReqBody: CreateCommentReqBody = {
        body: 'body',
      };
      const createCommentResBody = await request(app.getHttpServer())
        .post(`/user/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(commentCreateReqBody)
        .then((res) => {
          return typia.assert<ResponseForm<CreateCommentRes>>(res.body);
        });

      /** main test. */
      const findBestCommentsResBody = await request(app.getHttpServer())
        .get(`/user/posts/${postId}/best-comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .then((res) => {
          return typia.assert<ResponseForm<FindBestCommentsRes>>(res.body);
        });
      typia.assert<null>(findBestCommentsResBody.result.comment);
    });
  });
});
