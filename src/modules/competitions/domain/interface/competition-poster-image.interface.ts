import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IImage } from 'src/modules/images/domain/interface/image.interface';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

export interface ICompetitionPosterImage {
  /** UUID v7. */
  id: TId;

  /** competitionId */
  competitionId: IUser['id'];

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
