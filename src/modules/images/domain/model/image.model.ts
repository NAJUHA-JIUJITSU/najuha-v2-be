import { IImageModelData } from '../interface/image.interface';

export class ImageModel {
  private readonly id: IImageModelData['id'];
  private readonly path: IImageModelData['path'];
  private readonly format: IImageModelData['format'];
  private readonly createdAt: IImageModelData['createdAt'];
  private readonly linkedAt: IImageModelData['linkedAt'];
  private readonly userId: IImageModelData['userId'];

  constructor(data: IImageModelData) {
    this.id = data.id;
    this.path = data.path;
    this.format = data.format;
    this.createdAt = data.createdAt;
    this.linkedAt = data.linkedAt;
    this.userId = data.userId;
  }

  toData(): IImageModelData {
    return {
      id: this.id,
      path: this.path,
      format: this.format,
      createdAt: this.createdAt,
      linkedAt: this.linkedAt,
      userId: this.userId,
    };
  }
}
