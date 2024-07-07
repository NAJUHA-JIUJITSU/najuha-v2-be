import { ICommentReportModelData } from '../interface/comment-report.interface';

export class CommentReportModel {
  private readonly _id: ICommentReportModelData['id'];
  private readonly _type: ICommentReportModelData['type'];
  private readonly _status: ICommentReportModelData['status'];
  private readonly _commentId: ICommentReportModelData['commentId'];
  private readonly _userId: ICommentReportModelData['userId'];
  private readonly _createdAt: ICommentReportModelData['createdAt'];

  constructor(data: ICommentReportModelData) {
    this._id = data.id;
    this._type = data.type;
    this._status = data.status;
    this._commentId = data.commentId;
    this._userId = data.userId;
    this._createdAt = data.createdAt;
  }

  toData(): ICommentReportModelData {
    return {
      id: this._id,
      type: this._type,
      status: this._status,
      commentId: this._commentId,
      userId: this._userId,
      createdAt: this._createdAt,
    };
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get status() {
    return this._status;
  }

  get commentId() {
    return this._commentId;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }
}
