import { IPostReport } from '../interface/post-report.interface';

export class PostReportModel {
  public readonly id: IPostReport['id'];
  public readonly type: IPostReport['type'];
  public readonly status: IPostReport['status'];
  public readonly reason: IPostReport['reason'];
  public readonly postId: IPostReport['postId'];
  public readonly userId: IPostReport['userId'];
  public readonly createdAt: IPostReport['createdAt'];

  constructor(entity: IPostReport) {
    this.id = entity.id;
    this.type = entity.type;
    this.status = entity.status;
    this.reason = entity.reason;
    this.postId = entity.postId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): IPostReport {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      reason: this.reason,
      postId: this.postId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
