import { ICommentReport } from '../interface/comment-report.interface';

export class CommentReportModel {
  public readonly id: ICommentReport['id'];
  public readonly type: ICommentReport['type'];
  public readonly status: ICommentReport['status'];
  public readonly reason: ICommentReport['reason'];
  public readonly commentId: ICommentReport['commentId'];
  public readonly userId: ICommentReport['userId'];
  public readonly createdAt: ICommentReport['createdAt'];

  constructor(entity: ICommentReport) {
    this.id = entity.id;
    this.type = entity.type;
    this.status = entity.status;
    this.reason = entity.reason;
    this.commentId = entity.commentId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): ICommentReport {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      reason: this.reason,
      commentId: this.commentId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
