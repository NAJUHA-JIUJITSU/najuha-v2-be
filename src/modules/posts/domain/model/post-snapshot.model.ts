import { IPostSnapshotModelData } from '../interface/post-snapshot.interface';
import { PostSnapshotImageModel } from './post-snapshot-image.model';

export class PostSnapshotModel {
  private readonly _id: IPostSnapshotModelData['id'];
  private readonly _postId: IPostSnapshotModelData['postId'];
  private readonly _title: IPostSnapshotModelData['title'];
  private readonly _body: IPostSnapshotModelData['body'];
  private readonly _createdAt: IPostSnapshotModelData['createdAt'];
  private _postSnapshotImages: PostSnapshotImageModel[];

  constructor(data: IPostSnapshotModelData) {
    this._id = data.id;
    this._postId = data.postId;
    this._title = data.title;
    this._body = data.body;
    this._createdAt = data.createdAt;
    this._postSnapshotImages = data.postSnapshotImages?.map((image) => new PostSnapshotImageModel(image));
  }

  toData(): IPostSnapshotModelData {
    return {
      id: this._id,
      postId: this._postId,
      title: this._title,
      body: this._body,
      createdAt: this._createdAt,
      postSnapshotImages: this._postSnapshotImages.map((postSnapshotImage) => postSnapshotImage.toData()),
    };
  }

  get id() {
    return this._id;
  }

  get postId() {
    return this._postId;
  }

  get title() {
    return this._title;
  }

  get body() {
    return this._body;
  }

  get createdAt() {
    return this._createdAt;
  }

  get postSnapshotImages() {
    return this._postSnapshotImages;
  }

  addPostSnapshotImages(postSnapshotImages: PostSnapshotImageModel[]) {
    this._postSnapshotImages = postSnapshotImages;
  }
}
