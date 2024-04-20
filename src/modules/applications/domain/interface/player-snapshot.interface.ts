import { BirthDate } from 'src/common/typia-custom-tags/birth-date.tag';
import { IApplication } from './application.interface';

export interface IPlayerSnapshot {
  /**
   * - ULID.
   * @type string
   * @minLength 26
   * @maxLength 26
   */
  id: string;

  /**
   * - player name.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  name: string;

  /** - player gender */
  gender: 'MALE' | 'FEMALE';

  /**
   * - player birth (BirtDate YYYYMMDD).
   * @pattern ^[0-9]{8}$
   */
  birth: string & BirthDate;

  /**
   * - player phone number.
   * - ex) 01012345678.
   * @pattern ^01[0-9]{9}$
   */
  phoneNumber: string;

  /** - player belt */
  belt: '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

  /**
   * - 주짓수 네트워크.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  network: string;

  /**
   * - 소속 팀.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  team: string;

  /**
   * - 관장님 성함.
   * @minLength 1
   * @maxLength 64
   * @patter ^[a-zA-Z0-9ㄱ-ㅎ가-힣 ]{1,64}$
   */
  masterName: string;

  /** - 엔티티가 데이터베이스에 처음 저장될 때의 생성 시간. 자동으로 설정됩니다. */
  createdAt: Date | string;

  /** - application id. */
  applicationId: IApplication['id'];
}

export namespace IPlayerSnapshot {
  export namespace ModelValue {
    export interface Base extends IPlayerSnapshot {}
  }

  export interface CreateDto
    extends Pick<
      IPlayerSnapshot,
      'name' | 'gender' | 'birth' | 'phoneNumber' | 'belt' | 'network' | 'team' | 'masterName'
    > {}
}
