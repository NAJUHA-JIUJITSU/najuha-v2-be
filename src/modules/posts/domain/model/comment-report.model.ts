import { ICommentReportModelData } from '../interface/comment-report.interface';

export class CommentReportModel {
  public readonly id: ICommentReportModelData['id'];
  public readonly type: ICommentReportModelData['type'];
  public readonly status: ICommentReportModelData['status'];
  public readonly reason: ICommentReportModelData['reason'];
  public readonly commentId: ICommentReportModelData['commentId'];
  public readonly userId: ICommentReportModelData['userId'];
  public readonly createdAt: ICommentReportModelData['createdAt'];

  constructor(data: ICommentReportModelData) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.reason = data.reason;
    this.commentId = data.commentId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

  toData(): ICommentReportModelData {
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
