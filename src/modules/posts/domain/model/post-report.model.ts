import { IPostReport } from '../interface/post-report.interface';

export class PostReportModel {
  public readonly id: IPostReport['id'];
  public readonly postId: IPostReport['postId'];
  public readonly userId: IPostReport['userId'];
  public readonly createdAt: IPostReport['createdAt'];

  constructor(entity: IPostReport) {
    this.id = entity.id;
    this.postId = entity.postId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): IPostReport {
    return {
      id: this.id,
      postId: this.postId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
