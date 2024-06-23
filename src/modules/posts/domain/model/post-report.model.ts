import { uuidv7 } from 'uuidv7';
import { IPostReportCreateDto, IPostReportModelData } from '../interface/post-report.interface';

export class PostReportModel {
  public readonly id: IPostReportModelData['id'];
  public readonly type: IPostReportModelData['type'];
  public readonly status: IPostReportModelData['status'];
  public readonly reason: IPostReportModelData['reason'];
  public readonly postId: IPostReportModelData['postId'];
  public readonly userId: IPostReportModelData['userId'];
  public readonly createdAt: IPostReportModelData['createdAt'];

  static create(dto: IPostReportCreateDto): PostReportModel {
    return new PostReportModel({
      id: uuidv7(),
      type: dto.type,
      status: 'ACCEPTED',
      reason: dto.reason,
      postId: dto.postId,
      userId: dto.userId,
      createdAt: new Date(),
    });
  }

  constructor(data: IPostReportModelData) {
    this.id = data.id;
    this.type = data.type;
    this.status = data.status;
    this.reason = data.reason;
    this.postId = data.postId;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }

  toData(): IPostReportModelData {
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
