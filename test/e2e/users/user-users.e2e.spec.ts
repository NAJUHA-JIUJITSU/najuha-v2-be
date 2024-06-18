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
import { UserEntity } from '../../../src/database/entity/user/user.entity';
import { UserDummyBuilder } from '../../../src/dummy/user-dummy';
import {
  GetMeRes,
  UpdateUserReqBody,
  UpdateUserRes,
} from '../../../src/modules/users/presentation/users.controller.dto';
import * as fs from 'fs';
import * as FormData from 'form-data';
import axios from 'axios';

describe('E2E u-3 user-users test', () => {
  let app: INestApplication;
  let testingModule: TestingModule;
  let dataSource: DataSource;
  let entityEntityManager: EntityManager;
  let tableNames: string;
  let redisClient: Redis;
  let jwtService: JwtService;
  let userService: UsersAppService;

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
    (await app.init()).listen(appEnv.appPort);
  });

  afterEach(async () => {
    await entityEntityManager.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('u-3-2 PATCH /user/users --------------------------------------------------', () => {
    /** pre condition. */
    it('유저 정보 수정 성공 시', async () => {
      const dummyUser = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, dummyUser);
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const UpdateUserReqDto: UpdateUserReqBody = {
        name: 'updateName',
        nickname: 'updateNickname',
        gender: 'MALE',
        belt: '블랙',
        birth: '19980101',
      };
      /** main test. */
      const res = await request(app.getHttpServer())
        .patch('/user/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(UpdateUserReqDto);
      expect(typia.is<ResponseForm<UpdateUserRes>>(res.body)).toBe(true);
    });
  });

  describe('u-3-3 GET /user/users/me --------------------------------------------------', () => {
    it('내 정보 조회 성공 시', async () => {
      /** pre condition. */
      const dummyUser = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, dummyUser);
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const res = await request(app.getHttpServer())
        .get('/user/users/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<GetMeRes>>(res.body)).toBe(true);
      expect(res.body.result.user.id).toEqual(dummyUser.id);
    });
  });

  describe('u-3-4 POST /user/users/profile-image --------------------------------------------------', () => {
    it('프로필 이미지 생성 성공 시', async () => {
      /** pre condition. */
      const dummyUser = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, dummyUser);
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      /** main test. */
      const creatImageRes = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'user-profile' });
      const { image, presignedPost } = creatImageRes.body.result;
      const { url, fields } = presignedPost;
      const dummy5MbImageBuffer: Buffer = fs.readFileSync('test/resources/test-4.5mb.jpg');
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
      const res = await request(app.getHttpServer())
        .post('/user/users/profile-image')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ imageId: image.id });
      expect(typia.is<ResponseForm<GetMeRes>>(res.body)).toBe(true);
      expect(res.body.result.user.profileImages.length).toBe(1);
    });
  });

  describe('u-3-5 DELETE /user/users/profile-image --------------------------------------------------', () => {
    it('프로필 이미지 삭제 성공 시', async () => {
      /** pre condition. */
      const dummyUser = new UserDummyBuilder().build();
      await entityEntityManager.save(UserEntity, dummyUser);
      const accessToken = jwtService.sign(
        { userId: dummyUser.id, userRole: dummyUser.role },
        { secret: appEnv.jwtAccessTokenSecret, expiresIn: appEnv.jwtAccessTokenExpirationTime },
      );
      const creatImageRes = await request(app.getHttpServer())
        .post('/user/images')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ format: 'image/jpeg', path: 'user-profile' });
      const { image, presignedPost } = creatImageRes.body.result;
      const { url, fields } = presignedPost;
      const dummy5MbImageBuffer: Buffer = fs.readFileSync('test/resources/test-4.5mb.jpg');
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
      await request(app.getHttpServer())
        .post('/user/users/profile-image')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ imageId: image.id });
      /** main test. */
      const res = await request(app.getHttpServer())
        .delete('/user/users/profile-image')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(typia.is<ResponseForm<void>>(res.body)).toBe(true);
      const getMeRes = await request(app.getHttpServer())
        .get('/user/users/me')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(getMeRes.body.result.user.profileImages.length).toBe(0);
    });
  });
});