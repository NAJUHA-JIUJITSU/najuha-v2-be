import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IImage } from '../../../images/domain/interface/image.interface';
import { ICompetition } from './competition.interface';

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

export interface ICompetitionPosterImageCreateDto extends Pick<ICompetitionPosterImage, 'competitionId' | 'imageId'> {}
