import { ImageModel } from '../../../images/domain/model/image.model';
import { ICompetitionPosterImageModelData } from '../interface/competition-poster-image.interface';

export class CompetitionPosterImageModel {
  private readonly id: ICompetitionPosterImageModelData['id'];
  private readonly competitionId: ICompetitionPosterImageModelData['competitionId'];
  private readonly imageId: ICompetitionPosterImageModelData['imageId'];
  private readonly createdAt: ICompetitionPosterImageModelData['createdAt'];
  private deletedAt: ICompetitionPosterImageModelData['deletedAt'];
  private image: ImageModel;

  constructor(data: ICompetitionPosterImageModelData) {
    this.id = data.id;
    this.competitionId = data.competitionId;
    this.imageId = data.imageId;
    this.createdAt = data.createdAt;
    this.deletedAt = data.deletedAt;
    this.image = new ImageModel(data.image);
  }

  toData(): ICompetitionPosterImageModelData {
    return {
      id: this.id,
      competitionId: this.competitionId,
      imageId: this.imageId,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
      image: this.image.toData(),
    };
  }

  delete() {
    this.deletedAt = new Date();
  }
}
