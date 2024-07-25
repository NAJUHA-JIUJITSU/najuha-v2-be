import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IImage, IImageModelData } from '../../../images/domain/interface/image.interface';
import { ICompetition } from './competition.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * CompetitionPosterImage.
 *
 * - 실제 이미지에 대한 정보는 Image Entity를 통해 관리합니다.
 * - 해당 Entity는 대회 포스터 이미지와 대회를 매핑하는 역할을 합니다.
 */
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

  createdAt: TDateOrStringDate;

  /** deletedAt */
  deletedAt: TDateOrStringDate | null;

  /**
   * 실제 이미지 정보를 담고 있는 Image Entity.
   */
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
