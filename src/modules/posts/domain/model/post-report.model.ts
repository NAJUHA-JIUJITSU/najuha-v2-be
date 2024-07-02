import { IPostReportModelData } from '../interface/post-report.interface';

export class PostReportModel {
  public readonly id: IPostReportModelData['id'];
  public readonly type: IPostReportModelData['type'];
  public readonly status: IPostReportModelData['status'];
  public readonly postId: IPostReportModelData['postId'];
  public readonly userId: IPostReportModelData['userId'];
  public readonly createdAt: IPostReportModelData['createdAt'];

  constructor(data: IPostReportModelData) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.postId = data.postId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

  toData(): IPostReportModelData {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      postId: this.postId,
      userId: this.userId,
      createdAt: this.createdAt,
    };
  }
}
