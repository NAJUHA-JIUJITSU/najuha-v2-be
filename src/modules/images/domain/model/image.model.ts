import { IImageModelData } from '../interface/image.interface';

export class ImageModel {
  private readonly _id: IImageModelData['id'];
  private readonly _path: IImageModelData['path'];
  private readonly _format: IImageModelData['format'];
  private readonly _createdAt: IImageModelData['createdAt'];
  private readonly _linkedAt: IImageModelData['linkedAt'];
  private readonly _userId: IImageModelData['userId'];

  constructor(data: IImageModelData) {
    this._id = data.id;
    this._path = data.path;
    this._format = data.format;
    this._createdAt = data.createdAt;
    this._linkedAt = data.linkedAt;
    this._userId = data.userId;
  }

  toData(): IImageModelData {
    return {
      id: this._id,
      path: this._path,
      format: this._format,
      createdAt: this._createdAt,
      linkedAt: this._linkedAt,
      userId: this._userId,
    };
  }

  get id() {
    return this._id;
  }

  get path() {
    return this._path;
  }

  get format() {
    return this._format;
  }

  get createdAt() {
    return this._createdAt;
  }

  get linkedAt() {
    return this._linkedAt;
  }

  get userId() {
    return this._userId;
  }
}
