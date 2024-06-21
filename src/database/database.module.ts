import { Module, OnModuleInit } from '@nestjs/common';
import { PolicyRepository } from './custom-repository/policy.repository';
import { UserRepository } from './custom-repository/user.repository';
import { PolicyConsentRepository } from './custom-repository/policy-conset.repository';
import { CompetitionRepository } from './custom-repository/competition.repository';
import { DivisionRepository } from './custom-repository/division.repository';
import { EarlybirdDiscountSnapshotRepository } from './custom-repository/earlybird-discount-snapshot.repository';
import { CombinationDiscountSnapshotRepository } from './custom-repository/combination-discount-snapshot.repository';
import { ApplicationRepository } from './custom-repository/application.repository';
import { RequiredAdditionalInfoRepository } from './custom-repository/required-addtional-info.repository';
import { DataSeederService } from './data-seeder.service';
import { PostRepository } from './custom-repository/post.repository';
import { CommentRepository } from './custom-repository/comment.repository';
import { PostLikeRepository } from './custom-repository/post-like.repository';
import { PostReportRepository } from './custom-repository/post-report.repository';
import { CommentLikeRepository } from './custom-repository/comment-like.repository';
import { CommentReportRepository } from './custom-repository/comment-report.repository';
import { ImageRepository } from './custom-repository/image.repository';
import { BucketModule } from '../infrastructure/bucket/bucket.module';
import { TemporaryUserRepository } from './custom-repository/temporary-user.repository';

const repositories = [
  PolicyRepository,
  UserRepository,
  TemporaryUserRepository,
  PolicyConsentRepository,
  CompetitionRepository,
  DivisionRepository,
  EarlybirdDiscountSnapshotRepository,
  CombinationDiscountSnapshotRepository,
  ApplicationRepository,
  RequiredAdditionalInfoRepository,
  PostRepository,
  PostLikeRepository,
  PostReportRepository,
  CommentRepository,
  CommentLikeRepository,
  CommentReportRepository,
  ImageRepository,
];
@Module({
  imports: [BucketModule],
  providers: [...repositories, DataSeederService],
  exports: repositories,
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly dataSeederService: DataSeederService) {}

  async onModuleInit() {
    await this.dataSeederService.seed();
  }
}
