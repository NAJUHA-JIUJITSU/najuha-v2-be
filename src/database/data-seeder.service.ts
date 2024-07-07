import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import appEnv from '../common/app-env';
import { IUser } from '../modules/users/domain/interface/user.interface';
import { UserDummyBuilder } from '../dummy/user.dummy';
import { IPolicy } from '../modules/policy/domain/interface/policy.interface';
import { ICompetition } from '../modules/competitions/domain/interface/competition.interface';
import { IApplication } from '../modules/applications/domain/interface/application.interface';
import { generateDummyCompetitions } from '../dummy/competition.dummy';
import { generateDummyApplications } from '../dummy/application.dummy';
import { UserEntity } from './entity/user/user.entity';
import { CompetitionEntity } from './entity/competition/competition.entity';
import { ApplicationEntity } from './entity/application/application.entity';
import { PolicyEntity } from './entity/policy/policy.entity';
import { DivisionEntity } from './entity/competition/division.entity';
import { EarlybirdDiscountSnapshotEntity } from './entity/competition/earlybird-discount-snapshot.entity';
import { CombinationDiscountSnapshotEntity } from './entity/competition/combination-discount-snapshot.entity';
import { RequiredAdditionalInfoEntity } from './entity/competition/required-additional-info.entity';
import { PriceSnapshotEntity } from './entity/competition/price-snapshot.entity';
import { PlayerSnapshotEntity } from './entity/application/player-snapshot.entity';
import { ParticipationDivisionInfoEntity } from './entity/application/participation-division-info.entity';
import { ParticipationDivisionInfoSnapshotEntity } from './entity/application/participation-division-info-snapshot.entity';
import { AdditionalInfoEntity } from './entity/application/additional-info.entity';
import * as cliProgress from 'cli-progress';
import { dummyPolicies } from '../dummy/policy.dummy';
import { IDivision } from '../modules/competitions/domain/interface/division.interface';
import { IPriceSnapshot } from '../modules/competitions/domain/interface/price-snapshot.interface';
import { IEarlybirdDiscountSnapshot } from '../modules/competitions/domain/interface/earlybird-discount-snapshot.interface';
import { ICombinationDiscountSnapshot } from '../modules/competitions/domain/interface/combination-discount-snapshot.interface';
import { IRequiredAdditionalInfo } from '../modules/competitions/domain/interface/required-additional-info.interface';
import { IPlayerSnapshot } from '../modules/applications/domain/interface/player-snapshot.interface';
import { IParticipationDivisionInfo } from '../modules/applications/domain/interface/participation-division-info.interface';
import { IParticipationDivisionInfoSnapshot } from '../modules/applications/domain/interface/participation-division-info-snapshot.interface';
import { IAdditionalInfo } from '../modules/applications/domain/interface/additional-info.interface';
import { ICompetitionHostMap } from '../modules/competitions/domain/interface/competition-host-map.interface';
import { CompetitionHostMapEntity } from './entity/competition/competition-host.entity';
import { IPost } from '../modules/posts/domain/interface/post.interface';
import { IPostSnapshot } from '../modules/posts/domain/interface/post-snapshot.interface';
import { IPostSnapshotImage } from '../modules/posts/domain/interface/post-snapshot-image.interface';
import { IImage } from '../modules/images/domain/interface/image.interface';
import { PostEntity } from './entity/post/post.entity';
import { ImageEntity } from './entity/image/image.entity';
import { PostDummyBuilder } from '../dummy/post.dummy';
import { PostSnapshotEntity } from './entity/post/post-snapshot.entity';
import { PostSnapshotImageEntity } from './entity/post/post-snapshot-image.entity';
import { BucketService } from '../infrastructure/bucket/bucket.service';
import * as sharp from 'sharp';
import typia, { tags } from 'typia';
import { ICompetitionPosterImage } from '../modules/competitions/domain/interface/competition-poster-image.interface';
import { CompetitionPosterImageEntity } from './entity/competition/competition-poster-image.entity';
import { IUserProfileImage } from '../modules/users/domain/interface/user-profile-image.interface';
import { UserProfileImageEntity } from './entity/user/user-profile-image.entity';
import { TId } from '../common/common-types';
import { IComment } from '../modules/posts/domain/interface/comment.interface';
import { CommentDummyBuilder } from '../dummy/comment.dummy';
import { ICommentSnapshot } from '../modules/posts/domain/interface/comment-snapshot.interface';
import { CommentEntity } from './entity/post/comment.entity';
import { CommentSnapshotEntity } from './entity/post/comment-snapshot.entity';
import { DateTime } from '../common/utils/date-time';

/**
 * todo!!:
 * - data preparation, data batch insert 등의 메서드를 별도의 클래스로 분리하여 응집도를 높이세요.
 * - config 값을 이용하여 데이터를 삽입할 때 생성할 더미데이터 종류 및 개수를 설정할 수 있도록 하세요.
 * - 데이터 의존관계를 고려하여 적절한 에러 핸들링을 추가하세요.
 */
@Injectable()
export class DataSeederService {
  private queryRunner: QueryRunner;
  private users: IUser[] = [];
  private policies: IPolicy[] = [];
  private competitions: ICompetition[] = [];
  private applications: IApplication[] = [];
  private posts: IPost[] = [];
  private comments: IComment[] = [];
  // User
  private usersToSave: IUser[] = [];
  private policiesToSave: IPolicy[] = [];
  private userProfileImagesToSave: IUserProfileImage[] = [];
  // Competition
  private competitionsToSave: ICompetition[] = [];
  private divisionsToSave: IDivision[] = [];
  private priceSnapshotsToSave: IPriceSnapshot[] = [];
  private earlybirdDiscountSnapshotsToSave: IEarlybirdDiscountSnapshot[] = [];
  private combinationDiscountSnapshotsToSave: ICombinationDiscountSnapshot[] = [];
  private requiredAdditionalInfosToSave: IRequiredAdditionalInfo[] = [];
  private competitionHostMapsToSave: ICompetitionHostMap[] = [];
  private competitionPosterImagesToSave: ICompetitionPosterImage[] = [];
  // Application
  private applicationsToSave: IApplication[] = [];
  private playerSnapshotsToSave: IPlayerSnapshot[] = [];
  private participationDivisionInfosToSave: IParticipationDivisionInfo[] = [];
  private participationDivisionInfosSnapshotsToSave: IParticipationDivisionInfoSnapshot[] = [];
  private additionaInfosToSave: IAdditionalInfo[] = [];
  // Post
  private postsToSave: IPost[] = [];
  private postSnapshotsToSave: IPostSnapshot[] = [];
  private postSnapshotImagesToSave: IPostSnapshotImage[] = [];
  // Comment
  private commentsToSave: IComment[] = [];
  private commentSnapshotsToSave: ICommentSnapshot[] = [];
  // Image
  private imagesToSave: IImage[] = [];

  constructor(
    private readonly dataSource: DataSource,
    private readonly bucketService: BucketService,
  ) {
    this.queryRunner = this.dataSource.createQueryRunner();
  }

  async seed() {
    if (appEnv.nodeEnv !== 'dev' && appEnv.nodeEnv !== 'performance') {
      console.log('Data seeding is only available in development environment. Skipping seeding.');
      return;
    }
    if (await this.checkIfDataExists()) {
      console.log('Data already exists, skipping seeding.');
      return;
    }
    console.time('Total seeding time(prepareData + seedWithTransaction)');
    this.prepareData();
    /**
     * 아래 두 메서드중 하나를 선택하여 사용하세요.
     * seedWithTransactionSerial: 데이터를 순차적으로 삽입합니다. FK 제약 조건을 준수합니다. 약 45초 정도 소요됩니다.
     * seedWithTransactionParallel: 데이터를 병렬로 삽입합니다. FK 제약 조건을 무시합니다.  약 30초 정도 소요됩니다.
     */
    // await this.seedWithTransactionSerial();
    await this.seedWithTransactionParallel();
    console.timeEnd('Total seeding time(prepareData + seedWithTransaction)');
  }

  private async checkIfDataExists(): Promise<boolean> {
    const [userCount, policyCount, competitionCount, applicationCount, postCount, commentCount, imageCount] =
      await Promise.all([
        this.queryRunner.manager.getRepository(UserEntity).count(),
        this.queryRunner.manager.getRepository(PolicyEntity).count(),
        this.queryRunner.manager.getRepository(CompetitionEntity).count(),
        this.queryRunner.manager.getRepository(ApplicationEntity).count(),
        this.queryRunner.manager.getRepository(PostEntity).count(),
        this.queryRunner.manager.getRepository(CommentEntity).count(),
        this.queryRunner.manager.getRepository(ImageEntity).count(),
      ]);
    return (
      userCount > 0 ||
      policyCount > 0 ||
      competitionCount > 0 ||
      applicationCount > 0 ||
      postCount > 0 ||
      commentCount > 0 ||
      imageCount > 0
    );
  }

  private prepareData() {
    console.log('Preparing data...');
    console.time('Data preparation time');
    /**
     * if you want to use temporary users, use this.users = this.prepareTemporaryUsers();
     * if you want to use admin users, use this.users = this.prepareAdminUsers();
     * you can't use both at the same time. only use one of them.
     */
    // this.prepareTemporaryUsers();
    this.prepareAdminUsers();
    this.preparePolicies();
    this.prepareCompetitions(this.users);
    this.prepareApplications(this.users, this.competitions);
    this.preparePosts(this.users);
    this.prepareComments(this.users, this.posts);
    console.timeEnd('Data preparation time');
  }

  private prepareAdminUsers() {
    console.time('Admin users preparation time');
    const users = appEnv.adminCredentials.map((user) => {
      const { id, snsId, snsAuthProvider, name } = user;
      return new UserDummyBuilder()
        .setId(id)
        .setSnsId(snsId)
        .setRole('ADMIN')
        .setName(name)
        .setNickname(`${name}Nickname`)
        .setSnsAuthProvider(snsAuthProvider)
        .setProfileImage(id)
        .build();
    });
    this.users = users;
    this.usersToSave = users;
    this.userProfileImagesToSave = users.flatMap((user) => user.profileImages);
    this.imagesToSave.push(...this.userProfileImagesToSave.map((userProfileImage) => userProfileImage.image));
    console.timeEnd('Admin users preparation time');
  }

  private preparePolicies() {
    console.time('Policies preparation time');
    this.policies = dummyPolicies;
    this.policiesToSave = dummyPolicies;
    console.timeEnd('Policies preparation time');
  }

  private prepareCompetitions(users: IUser[]) {
    console.time('Competitions preparation time');
    const competitions = generateDummyCompetitions(
      users[0].id,
      users.map((user) => user.id),
    );
    this.competitions = competitions;
    this.competitionsToSave = competitions;
    this.divisionsToSave = competitions.flatMap((competition) => competition.divisions);
    this.priceSnapshotsToSave = this.divisionsToSave.flatMap((division) => division.priceSnapshots);
    this.earlybirdDiscountSnapshotsToSave = competitions.flatMap(
      (competition) => competition.earlybirdDiscountSnapshots,
    );
    this.combinationDiscountSnapshotsToSave = competitions.flatMap(
      (competition) => competition.combinationDiscountSnapshots,
    );
    this.requiredAdditionalInfosToSave = competitions.flatMap((competition) => competition.requiredAdditionalInfos);
    this.competitionHostMapsToSave = competitions.flatMap((competition) => competition.competitionHostMaps);
    this.competitionPosterImagesToSave = competitions.flatMap((competition) => competition.competitionPosterImages);
    this.imagesToSave.push(
      ...this.competitionPosterImagesToSave.map((competitionPosterImage) => competitionPosterImage.image),
    );
    console.timeEnd('Competitions preparation time');
  }

  private prepareApplications(users: IUser[], competitions: ICompetition[]) {
    console.time('Applications preparation time');
    const applications = users.flatMap((user) =>
      competitions.flatMap((competition) => {
        if (competition.isPartnership === false) return [];
        return generateDummyApplications(user, competition);
      }),
    );
    this.applications = applications;
    this.applicationsToSave = applications;
    this.playerSnapshotsToSave = applications.flatMap((application) => application.playerSnapshots);
    this.participationDivisionInfosToSave = applications.flatMap(
      (application) => application.participationDivisionInfos,
    );
    this.participationDivisionInfosSnapshotsToSave = this.participationDivisionInfosToSave.flatMap(
      (participationDivisionInfo) => participationDivisionInfo.participationDivisionInfoSnapshots,
    );
    this.additionaInfosToSave = applications.flatMap((application) => application.additionaInfos);
    console.timeEnd('Applications preparation time');
  }

  private preparePosts(users: IUser[]) {
    console.time('Posts preparation time');
    const now = new Date();
    let sequence = 0;
    const posts = users.flatMap((user) => {
      const postCount = 1000;
      const posts: IPost[] = [];
      for (let i = 0; i < postCount; i++)
        posts.push(new PostDummyBuilder(user.id).setCreatedAt(new Date(now.getTime() + sequence++ * 1000)).build());
      return posts;
    });
    this.posts = posts;
    this.postsToSave = posts;
    this.postSnapshotsToSave = posts.flatMap((post) => post.postSnapshots);
    this.postSnapshotImagesToSave = this.postSnapshotsToSave.flatMap((postSnapshot) => postSnapshot.postSnapshotImages);
    this.imagesToSave.push(...this.postSnapshotImagesToSave.map((postSnapshotImage) => postSnapshotImage.image));
    console.timeEnd('Posts preparation time');
  }

  private prepareComments(users: IUser[], posts: IPost[]) {
    console.time('Comments preparation time');
    const firstComments: IComment[] = [];
    const comments: IComment[] = [];
    const now = new Date();
    let sequence = 0;
    posts.forEach((post) => {
      const tmp: IComment[] = [];
      users.forEach((user) => {
        for (let i = 0; i < 10; i++)
          tmp.push(
            new CommentDummyBuilder(user.id, post.id).setCreatedAt(new Date(now.getTime() + sequence++ * 1000)).build(),
          );
      });
      comments.push(...tmp);
      firstComments.push(tmp[0]);
    });
    const replies: IComment[] = [];
    firstComments.forEach((firstComment) => {
      users.forEach((user) => {
        for (let i = 0; i < 10; i++)
          replies.push(
            new CommentDummyBuilder(user.id, firstComment.postId, firstComment.id)
              .setCreatedAt(new Date(now.getTime() + sequence++ * 1000))
              .build(),
          );
      });
    });
    this.comments = [...comments, ...replies];
    this.commentsToSave = this.comments;
    this.commentSnapshotsToSave = this.comments.flatMap((comment) => comment.commentSnapshots);
    console.timeEnd('Comments preparation time');
  }

  /**
   * 병렬로 데이터를 삽입합니다.
   * 병렬로 삽입하기 위해 FK 제약 조건을 무시하고 삽입합니다.
   */
  async seedWithTransactionParallel() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      console.time('Data seeding time');
      console.log('Start seeding data...');
      await this.queryRunner.query('SET session_replication_role = replica');
      await Promise.all([
        // User
        this.batchInsert(UserEntity, this.usersToSave),
        this.batchInsert(PolicyEntity, this.policiesToSave),
        this.batchInsert(UserProfileImageEntity, this.userProfileImagesToSave),
        // Competition
        this.batchInsert(CompetitionEntity, this.competitionsToSave),
        this.batchInsert(DivisionEntity, this.divisionsToSave),
        this.batchInsert(PriceSnapshotEntity, this.priceSnapshotsToSave),
        this.batchInsert(EarlybirdDiscountSnapshotEntity, this.earlybirdDiscountSnapshotsToSave),
        this.batchInsert(CombinationDiscountSnapshotEntity, this.combinationDiscountSnapshotsToSave),
        this.batchInsert(RequiredAdditionalInfoEntity, this.requiredAdditionalInfosToSave),
        this.batchInsert(CompetitionHostMapEntity, this.competitionHostMapsToSave),
        this.batchInsert(CompetitionPosterImageEntity, this.competitionPosterImagesToSave),
        // Application
        this.batchInsert(ApplicationEntity, this.applicationsToSave),
        this.batchInsert(PlayerSnapshotEntity, this.playerSnapshotsToSave),
        this.batchInsert(ParticipationDivisionInfoEntity, this.participationDivisionInfosToSave),
        this.batchInsert(ParticipationDivisionInfoSnapshotEntity, this.participationDivisionInfosSnapshotsToSave),
        this.batchInsert(AdditionalInfoEntity, this.additionaInfosToSave),
        // Post
        this.batchInsert(PostEntity, this.postsToSave),
        this.batchInsert(PostSnapshotEntity, this.postSnapshotsToSave),
        this.batchInsert(PostSnapshotImageEntity, this.postSnapshotImagesToSave),
        //Comment
        this.batchInsert(CommentEntity, this.commentsToSave),
        this.batchInsert(CommentSnapshotEntity, this.commentSnapshotsToSave),
        // Image
        this.batchInsert(ImageEntity, this.imagesToSave),
        this.uploadImages(this.imagesToSave),
      ]);
      await this.queryRunner.query('SET session_replication_role = DEFAULT');
      await this.rebuildIndexes();
      await this.queryRunner.commitTransaction();
      console.log('Data seeding completed.');
      console.timeEnd('Data seeding time');
    } catch (error) {
      console.error('Seeding failed, rolling back.', error);
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }

  //todo!!: 테이블명 자동으로 가져오도록 수정
  private async rebuildIndexes() {
    console.time('Rebuilding indexes time');
    const tableNames = [
      'user',
      'policy',
      'competition',
      'division',
      'price_snapshot',
      'earlybird_discount_snapshot',
      'combination_discount_snapshot',
      'required_additional_info',
      'competition_host_map',
      'application',
      'player_snapshot',
      'participation_division_info',
      'participation_division_info_snapshot',
      'additional_info',
    ];
    for (const tableName of tableNames) {
      await this.queryRunner.query(`REINDEX TABLE "${tableName}"`);
    }
    console.timeEnd('Rebuilding indexes time');
  }

  /**
   * 순차적으로 데이터를 삽입합니다.
   * 순차적으로 삽입하기 때문에 FK 제약 조건을 검사합니다.
   */
  async seedWithTransactionSerial() {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    try {
      console.time('Data seeding time');
      console.log('Start seeding data...');
      // User
      await this.batchInsert(UserEntity, this.usersToSave);
      await this.batchInsert(PolicyEntity, this.policiesToSave);
      await this.batchInsert(UserProfileImageEntity, this.userProfileImagesToSave);
      // Competition
      await this.batchInsert(CompetitionEntity, this.competitionsToSave);
      await this.batchInsert(DivisionEntity, this.divisionsToSave);
      await this.batchInsert(PriceSnapshotEntity, this.priceSnapshotsToSave);
      await this.batchInsert(EarlybirdDiscountSnapshotEntity, this.earlybirdDiscountSnapshotsToSave);
      await this.batchInsert(CombinationDiscountSnapshotEntity, this.combinationDiscountSnapshotsToSave);
      await this.batchInsert(RequiredAdditionalInfoEntity, this.requiredAdditionalInfosToSave);
      await this.batchInsert(CompetitionHostMapEntity, this.competitionHostMapsToSave);
      await this.batchInsert(CompetitionPosterImageEntity, this.competitionPosterImagesToSave);
      // Application
      await this.batchInsert(ApplicationEntity, this.applicationsToSave);
      await this.batchInsert(PlayerSnapshotEntity, this.playerSnapshotsToSave);
      await this.batchInsert(ParticipationDivisionInfoEntity, this.participationDivisionInfosToSave);
      await this.batchInsert(ParticipationDivisionInfoSnapshotEntity, this.participationDivisionInfosSnapshotsToSave);
      await this.batchInsert(AdditionalInfoEntity, this.additionaInfosToSave);
      // Post
      await this.batchInsert(PostEntity, this.postsToSave);
      await this.batchInsert(PostSnapshotEntity, this.postSnapshotsToSave);
      await this.batchInsert(PostSnapshotImageEntity, this.postSnapshotImagesToSave);
      // Comment
      await this.batchInsert(CommentEntity, this.commentsToSave);
      await this.batchInsert(CommentSnapshotEntity, this.commentSnapshotsToSave);
      // Image
      await this.batchInsert(ImageEntity, this.imagesToSave);
      await this.uploadImages(this.imagesToSave);
      await this.queryRunner.commitTransaction();
      console.log('Data seeding completed.');
      console.timeEnd('Data seeding time');
    } catch (error) {
      console.error('Seeding failed, rolling back.', error);
      await this.queryRunner.rollbackTransaction();
    } finally {
      await this.queryRunner.release();
    }
  }

  private async batchInsert<T>(entity: new () => T, data: any[]) {
    const entityName = entity.name;
    const batchSize = 1000;
    const progressBar = new cliProgress.SingleBar(
      {
        format: `{bar} | {entityName} | {percentage}% | {value}/{total} | {duration_formatted}`,
      },
      cliProgress.Presets.legacy,
    );
    progressBar.start(data.length, 0, { entityName });
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await this.queryRunner.manager.getRepository(entity).insert(batch);
      progressBar.update(Math.min(i + batchSize, data.length));
    }
    progressBar.stop();
  }

  private async uploadImages(images: IImage[]) {
    const batchSize = 1000;
    const imageBuffers = await this.getRamdomImageBuffers();
    const progressBar = new cliProgress.SingleBar(
      {
        format: `{bar} | Image Upload To Bucket | {percentage}% | {value}/{total} | {duration_formatted}`,
      },
      cliProgress.Presets.legacy,
    );
    progressBar.start(images.length, 0);
    for (let i = 0; i < images.length; i += batchSize) {
      const batch = images.slice(i, i + batchSize);
      const uploadPromises = batch.map(async (image, index) => {
        await this.bucketService.uploadObject(
          `${image.path}/${image.id}`,
          imageBuffers[index % imageBuffers.length],
          image.format,
        );
        progressBar.update(Math.min(i + batchSize, images.length));
      });
      await Promise.all(uploadPromises);
    }
    progressBar.stop();
  }

  private async getRamdomImageBuffers(): Promise<Buffer[]> {
    const dummyImageBuffers: Promise<Buffer>[] = [];
    for (let i = 0; i < 100; i++) {
      const randomColor = this.getRamdomColor();
      const dummyImageSize = this.getRamdomSize();
      const buffer = sharp({
        create: {
          width: dummyImageSize.width,
          height: dummyImageSize.height,
          channels: 3,
          background: randomColor,
        },
      })
        .jpeg()
        .toBuffer();
      dummyImageBuffers.push(buffer);
    }
    return Promise.all(dummyImageBuffers);
  }

  private getRamdomColor() {
    return {
      r: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<255>>(),
      g: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<255>>(),
      b: typia.random<number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<255>>(),
    };
  }
  private getRamdomSize() {
    return {
      width: typia.random<number & tags.Type<'uint32'> & tags.Minimum<100> & tags.Maximum<1000>>(),
      height: typia.random<number & tags.Type<'uint32'> & tags.Minimum<100> & tags.Maximum<1000>>(),
    };
  }
}
