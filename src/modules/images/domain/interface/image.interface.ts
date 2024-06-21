import { TDateOrStringDate, TId } from '../../../../common/common-types';
import { IUser } from '../../../users/domain/interface/user.interface';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
export interface IImage {
  /**
   * UUID v7.
   * - s3 bucket에 저장되는 이미지의 key로 사용됩니다.
   * - `${bucketHost}/${bucketName}/${path}/${id}` 로 접근 가능합니다.
   * - ex) http://localhost:9000/najuha-v2-bucket/competition/019000fb-11c3-7766-ad55-17c0c2b18cae
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

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IImageModelData {
  id: IImage['id'];
  path: IImage['path'];
  format: IImage['format'];
  createdAt: IImage['createdAt'];
  linkedAt: IImage['linkedAt'];
  userId: IImage['userId'];
}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IImageCreateDto {
  userId: IUser['id'];
  path: TImagePath;
  format: TImageFormat;
}

// ----------------------------------------------------------------------------
// ENUM
// ----------------------------------------------------------------------------
export type TImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export type TImagePath = 'user-profile' | 'competition' | 'post';
