import { uuidv7 } from 'uuidv7';
import { ICommentReportCreateDto, ICommentReportModelData } from '../interface/comment-report.interface';

export class CommentReportModel {
  public readonly id: ICommentReportModelData['id'];
  public readonly type: ICommentReportModelData['type'];
  public readonly status: ICommentReportModelData['status'];
  public readonly reason: ICommentReportModelData['reason'];
  public readonly commentId: ICommentReportModelData['commentId'];
  public readonly userId: ICommentReportModelData['userId'];
  public readonly createdAt: ICommentReportModelData['createdAt'];

  static create(dto: ICommentReportCreateDto): CommentReportModel {
    return new CommentReportModel({
      id: uuidv7(),
      type: dto.type,
      status: 'ACCEPTED',
      reason: dto.reason,
      commentId: dto.commentId,
      userId: dto.userId,
      createdAt: new Date(),
    });
  }

  constructor(entity: ICommentReportModelData) {
    this.id = entity.id;
    this.type = entity.type;
    this.status = entity.status;
    this.reason = entity.reason;
    this.commentId = entity.commentId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
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
