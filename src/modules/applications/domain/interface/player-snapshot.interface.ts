import { BirthDate } from '../../../../common/typia-custom-tags/birth-date.tag';
import { IApplication } from './application.interface';
import { tags } from 'typia';
import { TId, TDateOrStringDate } from '../../../../common/common-types';

// ----------------------------------------------------------------------------
// Base Interface
// ----------------------------------------------------------------------------
/**
 * PlayerSnapshot.
 *
 * 주짓수 대회 참가자의 정보 스냅샷.
 * - 대회 참가자의 정보를 스냅샷하여 저장합니다.
 * - 대회 참가자의 정보는 변경될때마다 스냅샷을 생성합니다. (변경 이력 추적)
 */
export interface IPlayerSnapshot {
  /** UUID v7. */
  id: TId;

  /**
   * 선수 이름. (한글, 영문, 숫자, 공백 입력 가능합니다).
   */
  name: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** 선수 성별. */
  gender: 'MALE' | 'FEMALE';

  /** 선수 생년월일 (BirtDate YYYYMMDD). */
  birth: string & BirthDate & tags.Pattern<'^[0-9]{8}$'>;

  /** 선수 휴대폰 번호. ex) 01012345678. */
  phoneNumber: string & tags.Pattern<'^01[0-9]{9}$'>;

  /** 선수 주짓수 벨트. */
  belt: '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

  /** 주짓수 네트워크. (한글, 영문, 숫자, 공백 입력 가능합니다). */
  network: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** 소속 팀. (한글, 영문, 숫자, 공백 입력 가능합니다). */
  team: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** 관장님 성함. */
  masterName: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  createdAt: TDateOrStringDate;

  /** Application id. */
  applicationId: IApplication['id'];
}

// ----------------------------------------------------------------------------
// Model Data
// ----------------------------------------------------------------------------
export interface IPlayerSnapshotModelData extends IPlayerSnapshot {}

// ----------------------------------------------------------------------------
// DTO
// ----------------------------------------------------------------------------
export interface IPlayerSnapshotCreateDto
  extends Pick<
    IPlayerSnapshot,
    'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
  > {}
