import { BirthDate } from 'src/common/typia-custom-tags/birth-date.tag';
import { IApplication } from './application.interface';
import { tags } from 'typia';

export interface IPlayerSnapshot {
  /** ULID. */
  id: string & tags.MinLength<26> & tags.MaxLength<26>;

  /**
   * Player name. (한글, 영문, 숫자, 공백 입력 가능합니다).
   */
  name: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** Player gender. */
  gender: 'MALE' | 'FEMALE';

  /** Player birth (BirtDate YYYYMMDD). */
  birth: string & BirthDate & tags.Pattern<'^[0-9]{8}$'>;

  /** Player phoneNumber. ex) 01012345678. */
  phoneNumber: string & tags.Pattern<'^01[0-9]{9}$'>;

  /** Player belt. */
  belt: '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

  /** 주짓수 네트워크. (한글, 영문, 숫자, 공백 입력 가능합니다). */
  network: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** 소속 팀. (한글, 영문, 숫자, 공백 입력 가능합니다). */
  team: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** 관장님 성함. */
  masterName: string & tags.MinLength<1> & tags.MaxLength<64> & tags.Pattern<'^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$'>;

  /** CreatedAt */
  createdAt: Date | (string & tags.Format<'date-time'>);

  /** Application id. */
  applicationId: IApplication['id'];
}

export interface IPlayerSnapshotCreateDto
  extends Pick<
    IPlayerSnapshot,
    'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
  > {}
