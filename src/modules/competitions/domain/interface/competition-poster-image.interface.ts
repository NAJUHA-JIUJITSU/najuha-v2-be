import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IImage, IImageModelData } from '../../../images/domain/interface/image.interface';
import { ICompetition } from './competition.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface ICompetitionPosterImage {
  /** UUID v7. */
  id: TId;

  /** competitionId */
  competitionId: ICompetition['id'];

  /**
   * imageId
   * - u-9-1 createImage 로 생성된 image의 id
   */
  imageId: IImage['id'];

  /** createdAt */
  createdAt: TDateOrStringDate;

  /** deletedAt */
  deletedAt: TDateOrStringDate | null;

  image: IImage;
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface ICompetitionPosterImageModelData {
  id: ICompetitionPosterImage['id'];
  competitionId: ICompetitionPosterImage['competitionId'];
  imageId: ICompetitionPosterImage['imageId'];
  createdAt: ICompetitionPosterImage['createdAt'];
  deletedAt: ICompetitionPosterImage['deletedAt'];
  image: IImageModelData;
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface ICompetitionPosterImageCreateDto extends Pick<ICompetitionPosterImage, 'competitionId' | 'imageId'> {}
