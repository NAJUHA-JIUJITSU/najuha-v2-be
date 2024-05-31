import { ICommentReport } from '../interface/comment-report.interface';

export class CommentReportModel {
  public readonly id: ICommentReport['id'];
  public readonly commentId: ICommentReport['commentId'];
  public readonly userId: ICommentReport['userId'];
  public readonly createdAt: ICommentReport['createdAt'];

  constructor(entity: ICommentReport) {
    this.id = entity.id;
    this.commentId = entity.commentId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): ICommentReport {
    return {
      id: this.id,
      commentId: this.commentId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
