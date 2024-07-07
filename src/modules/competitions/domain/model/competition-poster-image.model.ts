import { ImageModel } from '../../../images/domain/model/image.model';
import { ICompetitionPosterImageModelData } from '../interface/competition-poster-image.interface';

export class CompetitionPosterImageModel {
  /** properties */
  private readonly _id: ICompetitionPosterImageModelData['id'];
  private readonly _competitionId: ICompetitionPosterImageModelData['competitionId'];
  private readonly _imageId: ICompetitionPosterImageModelData['imageId'];
  private readonly _createdAt: ICompetitionPosterImageModelData['createdAt'];
  private _deletedAt: ICompetitionPosterImageModelData['deletedAt'];
  /** relations */
  private _image: ImageModel;

  constructor(data: ICompetitionPosterImageModelData) {
    this._id = data.id;
    this._competitionId = data.competitionId;
    this._imageId = data.imageId;
    this._createdAt = data.createdAt;
    this._deletedAt = data.deletedAt;
    this._image = new ImageModel(data.image);
  }

  toData(): ICompetitionPosterImageModelData {
    return {
      id: this._id,
      competitionId: this._competitionId,
      imageId: this._imageId,
      createdAt: this._createdAt,
      deletedAt: this._deletedAt,
      image: this._image.toData(),
    };
  }

  get id() {
    return this._id;
  }

  get competitionId() {
    return this._competitionId;
  }

  get imageId() {
    return this._imageId;
  }

  get createdAt() {
    return this._createdAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }

  get image() {
    return this._image;
  }

  delete() {
    this._deletedAt = new Date();
  }
}
