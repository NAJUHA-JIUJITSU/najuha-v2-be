import { IPostReportModelData } from '../interface/post-report.interface';

export class PostReportModel {
  private readonly _id: IPostReportModelData['id'];
  private readonly _type: IPostReportModelData['type'];
  private readonly _status: IPostReportModelData['status'];
  private readonly _postId: IPostReportModelData['postId'];
  private readonly _userId: IPostReportModelData['userId'];
  private readonly _createdAt: IPostReportModelData['createdAt'];

  constructor(data: IPostReportModelData) {
    this._id = data.id;
    this._type = data.type;
    this._status = data.status;
    this._postId = data.postId;
    this._userId = data.userId;
    this._createdAt = data.createdAt;
  }

  toData(): IPostReportModelData {
    return {
      id: this._id,
      type: this._type,
      status: this._status,
      postId: this._postId,
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

  get postId() {
    return this._postId;
  }

  get userId() {
    return this._userId;
  }

  get createdAt() {
    return this._createdAt;
  }
}
