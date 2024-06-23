import { uuidv7 } from 'uuidv7';
import { IPostSnapshotCreateDto, IPostSnapshotModelData } from '../interface/post-snapshot.interface';
import { PostSnapshotImageModel } from './post-snapshot-image.model';

export class PostSnapshotModel {
  public id: IPostSnapshotModelData['id'];
  private readonly postId: IPostSnapshotModelData['postId'];
  private readonly title: IPostSnapshotModelData['title'];
  private readonly body: IPostSnapshotModelData['body'];
  private readonly createdAt: IPostSnapshotModelData['createdAt'];
  private postSnapshotImages?: PostSnapshotImageModel[];

  static create(dto: IPostSnapshotCreateDto) {
    return new PostSnapshotModel({
      id: uuidv7(),
      postId: dto.postId,
      title: dto.title,
      body: dto.body,
      createdAt: new Date(),
      postSnapshotImages: [],
    });
  }

  constructor(data: IPostSnapshotModelData) {
    this.id = data.id;
    this.postId = data.postId;
    this.title = data.title;
    this.body = data.body;
    this.createdAt = data.createdAt;
    this.postSnapshotImages = data.postSnapshotImages?.map((image) => new PostSnapshotImageModel(image));
  }

  toData(): IPostSnapshotModelData {
    return {
      id: this.id,
      postId: this.postId,
      title: this.title,
      body: this.body,
      createdAt: this.createdAt,
      postSnapshotImages: this.postSnapshotImages?.map((postSnapshotImage) => postSnapshotImage.toData()),
    };
  }

  addPostSnapshotImages(postSnapshotImages: PostSnapshotImageModel[]) {
    this.postSnapshotImages = postSnapshotImages;
  }
}
