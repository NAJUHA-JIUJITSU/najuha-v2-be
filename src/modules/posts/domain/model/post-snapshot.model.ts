import { uuidv7 } from 'uuidv7';
import { IPostSnapshotCreateDto, IPostSnapshotModelData } from '../interface/post-snapshot.interface';
import { PostSnapshotImageModel } from './post-snapshot-image.model';

export class PostSnapshotModel {
  public id: IPostSnapshotModelData['id'];
  private readonly postId: IPostSnapshotModelData['postId'];
  private readonly title: IPostSnapshotModelData['title'];
  private readonly body: IPostSnapshotModelData['body'];
  private readonly createdAt: IPostSnapshotModelData['createdAt'];
  private postSnapshotImages: PostSnapshotImageModel[];

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

  constructor(entity: IPostSnapshotModelData) {
    this.id = entity.id;
    this.postId = entity.postId;
    this.title = entity.title;
    this.body = entity.body;
    this.createdAt = entity.createdAt;
    this.postSnapshotImages = entity.postSnapshotImages.map((image) => new PostSnapshotImageModel(image));
  }

  toEntity(): IPostSnapshotModelData {
    return {
      id: this.id,
      postId: this.postId,
      title: this.title,
      body: this.body,
      createdAt: this.createdAt,
      postSnapshotImages: this.postSnapshotImages.map((image) => image.toData()),
    };
  }

  addPostSnapshotImages(postSnapshotImages: PostSnapshotImageModel[]) {
    this.postSnapshotImages.push(...postSnapshotImages);
  }
}
