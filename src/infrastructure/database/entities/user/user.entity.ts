import { PolicyConsentEntity } from 'src/infrastructure/database/entities/policy/policy-consent.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { BirthDate } from 'src/common/typia-custom-tags/birth-date.tag';
import { ApplicationPackageEntity } from '../application/application-package.entity';

/**
 * - 각 snsAuthProvider 마다 제공되는 정보.
 * - kakao  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - naver  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - google : snsId, email, name.
 * - apple  : snsId, email, name.
 */
@Entity('user')
export class UserEntity {
  /**
   * - 사용자 ID. 데이터베이스에서 자동 생성됩니다.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: number;

  /** - 사용자 역할. 사용자의 접근 권한을 나타냅니다. */
  @Column('varchar', { length: 16, default: 'TEMPORARY_USER' })
  role: 'ADMIN' | 'USER' | 'TEMPORARY_USER';

  /** - SNS 공급자. 사용자가 로그인하는데 사용한 SNS 플랫폼을 나타냅니다. */
  @Column('varchar', { length: 16 })
  snsAuthProvider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE'; //TODO: enum으로 변경?

  /**
   * - SNS ID. 소셜 로그인을 위한 고유 식별자입니다.
   * @minLength 1
   * @maxLength 256
   */
  @Column('varchar', { length: 256 })
  snsId: string;

  /**
   * - 사용자 이메일 주소.
   * @minLength 1
   * @maxLength 320
   * @format email
   */
  @Column('varchar', { length: 320 })
  email: string;

  /**
   * - 사용자 이름. (컬럼길이는 256으로 설정하였으나, 입력값 유효성검사는 64자 이내로 설정하도록 합니다.)
   * @minLength 1
   * @maxLength 64
   * @pattern ^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$
   */
  @Column('varchar', { length: 256, nullable: true })
  name: string;

  /**
   * - 사용자 전화번호. 01012345678.
   * - 전화번호가 저장되어 있으면 인증된 전화번호 입니다.
   * @pattern ^01[0-9]{9}$
   */
  @Column('varchar', { length: 16, nullable: true })
  phoneNumber: string;

  /**
   * - 사용자 별명. (영문, 한글, 숫자만 입력 가능합니다.)
   * @minLength 1
   * @maxLength 64
   * @pattern ^[a-zA-Z0-9ㄱ-ㅎ가-힣]{1,64}$
   */
  @Column('varchar', { length: 64, nullable: true, unique: true })
  nickname: string;

  /** - 사용자 성별. */
  @Column('varchar', { length: 16, nullable: true })
  gender: 'MALE' | 'FEMALE';

  /**
   * - 사용자 생년월일 (BirtDate YYYYMMDD).
   * @pattern ^[0-9]{8}$
   */
  @Column('varchar', { length: 8, nullable: true })
  birth: string & BirthDate;

  /** - 사용자 주짓수 벨트. */
  @Column('varchar', { length: 16, nullable: true })
  belt: '선택없음' | '화이트' | '블루' | '퍼플' | '브라운' | '블랙';

  /**
   * - 사용자 프로필 이미지 키 (이미지 파일 이름). (썸네일 이미지 역할).
   * - 참고 s3 image key 최대길이 1024(https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html).
   * @minLength 1
   * @maxLength 128
   */
  @Column('varchar', { length: 128, nullable: true })
  profileImageUrlKey: string;

  /**- 사용자 상태. 활성, 비활성 등을 나타냅니다. */
  @Column('varchar', { length: 16, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: string | Date;

  /** - 최종 업데이트 시간. 엔티티가 수정될 때마다 자동으로 업데이트됩니다. */
  @UpdateDateColumn()
  updatedAt: string | Date;

  /**
   * - 사용자가 동의한 약관 정보
   * - OneToMany: User(1) -> PolicyConsent(*)
   */
  @OneToMany(() => PolicyConsentEntity, (policyConsent) => policyConsent.user)
  policyConsents?: PolicyConsentEntity[];

  @OneToMany(() => ApplicationPackageEntity, (applicationPackage) => applicationPackage.user)
  applicationPackages?: ApplicationPackageEntity[];
}
