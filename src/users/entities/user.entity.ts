import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // Index,
} from 'typeorm';

/**
 * - 각 snsAuthProvider 마다 제공되는 정보.
 * - kakao  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - naver  : snsId, email, name, phoneNumber, gender, birthday, birthyear.
 * - google : snsId, email, name.
 * - apple  : snsId, email, name.
 */
@Entity('user')
export class UserEntity {
  /** - 사용자 ID. 데이터베이스에서 자동 생성됩니다. */
  @PrimaryGeneratedColumn()
  id: number;

  /** - 사용자 역할. 사용자의 접근 권한을 나타냅니다. */
  @Column('varchar', { length: 50, default: 'TEMPORARY_USER' })
  role: 'ADMIN' | 'USER' | 'TEMPORARY_USER';

  /** - SNS 공급자. 사용자가 로그인하는데 사용한 SNS 플랫폼을 나타냅니다. */
  @Column('varchar', { length: 50 })
  snsAuthProvider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE'; //TODO: enum으로 변경?

  /** - SNS ID. 소셜 로그인을 위한 고유 식별자입니다. */
  @Column('varchar', { length: 256 })
  snsId: string;

  /**
   * - 사용자 이메일 주소 (일단 필요없으나 수집이 쉽고, 추후에 필요할수도 있으니 일단 넣어둠).
   * @minLength 1
   * @maxLength 320
   * @format email
   */
  @Column({ length: 320 })
  email: string;

  /**
   * // TODO: 정규식으로 유효성 검사를 해야할듯
   * - 사용자 이름. (컬럼길이는 256으로 설정하였으나, 입력값 유효성검사는 64자 이내로 설정하도록 합니다.)
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 256, nullable: true })
  name: string | null;

  /** - 사용자 전화번호. 국제전화번호 E.164 규격을 따릅니다. ex) +821012345678. */
  @Column('varchar', { length: 100, nullable: true })
  phoneNumber: string | null;

  /**
   * // TODO: 정규식으로 유효성 검사를 해야할듯
   * 사용자 별명.
   * @minLength 1
   * @maxLength 64
   */
  @Column('varchar', { length: 64, nullable: true })
  nickname: string | null;

  /** 사용자 성별. */
  @Column('varchar', { nullable: true })
  gender: 'MALE' | 'FEMALE' | null;

  /**
   * 사용자 생년월일 (YYYYMMDD).
   * @pattern ^\d{8}$
   */
  @Column('varchar', { length: 8, nullable: true })
  birth: string | null;

  /** 사용자 주짓수 벨트. */
  @Column('varchar', { nullable: true })
  belt: '화이트' | '블루' | '퍼플' | '브라운' | '블랙' | null;

  /** 사용자 체중. */
  @Column('float', { nullable: true })
  weight: number | null;

  /**
   * - 사용자 프로필 이미지 키. (썸네일 이미지 역할).
   * - 참고 s3 image key 최대길이 (https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html).
   * @minLength 1
   * @maxLength 1024
   */
  @Column('varchar', { length: 1024, nullable: true })
  profileImageUrlKey: string | null;

  /**- 사용자 상태. 활성, 비활성 등을 나타냅니다. */
  @Column('varchar', { length: 10, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: Date;

  /** - 최종 업데이트 시간. 엔티티가 수정될 때마다 자동으로 업데이트됩니다. */
  @UpdateDateColumn()
  updatedAt: Date;
}
