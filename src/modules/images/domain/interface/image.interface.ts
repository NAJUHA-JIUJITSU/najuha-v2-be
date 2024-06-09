import { TDateOrStringDate, TId } from 'src/common/common-types';
import { IUser } from 'src/modules/users/domain/interface/user.interface';

/**
 * Image Interface
 */
export interface IImage {
  /**
   * UUID v7.
   * - s3 bucket에 저장되는 이미지의 key로 사용됩니다.
   */
  id: TId;

  /**
   * s3 bucket에 저장되는 이미지의 경로
   * - user 프로필 이미지를 생성하는 경우: `user-profile` 로 설로
   * - competition 이미지를 생성하는 경우: `competition` 로 설정
   * - post 이미지를 생성하는 경우: `post` 로 설정
   */
  path: TImagePath;

  /** image format. */
  format: TImageFormat;

  /**
   * createdAt.
   * - 이미지가 생성된 시간
   */
  createdAt: TDateOrStringDate;

  /**
   * linkedAt.
   * - 이미지를 소유한 entity에 FK로 연결된 시간.
   * - null 이면 연결되지 않은 이미지.
   * - createdAt + 10분 이후에도 연결되지 않은 이미지는 주기적으로 삭제됩니다.
   */
  linkedAt: TDateOrStringDate | null;

  /**
   * userId.
   * - 이미지를 생성한 계정의 userId.
   */
  userId: IUser['id'];
}

type TImageFormat = 'jpeg' | 'png' | 'webp';

type TImagePath = 'user-profile' | 'competition' | 'post';

export interface IImageCreateDto {
  userId: IUser['id'];
  path: TImagePath;
  format: TImageFormat;
}
