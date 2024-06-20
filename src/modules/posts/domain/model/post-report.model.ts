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

  constructor(entity: IPostReportModelData) {
    this.id = entity.id;
    this.type = entity.type;
    this.status = entity.status;
    this.reason = entity.reason;
    this.postId = entity.postId;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
  }

  toEntity(): IPostReportModelData {
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
