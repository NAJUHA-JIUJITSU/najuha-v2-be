import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  // Index,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  /**
   * 사용자 ID. 데이터베이스에서 자동 생성됩니다.
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * SNS ID. 소셜 로그인을 위한 고유 식별자입니다.
   */
  @Column('varchar', { length: 128 })
  snsId: string;

  /**
   * SNS 공급자. 사용자가 로그인하는데 사용한 SNS 플랫폼을 나타냅니다.
   */
  @Column('varchar', { length: 30 })
  snsAuthProvider: 'KAKAO' | 'NAVER' | 'GOOGLE' | 'APPLE'; //TODO: enum으로 변경

  /**
   * 사용자 역할. 사용자의 접근 권한을 나타냅니다.
   */
  @Column('varchar', { length: 20, default: 'TEMPORARY_USER' })
  role: 'ADMIN' | 'USER' | 'TEMPORARY_USER';

  /**
   * 사용자 이메일 주소.
   *
   * @minLength 1
   * @maxLength 150
   * @format email
   */
  @Column({ length: 150 })
  // @Index({ unique: true })
  email: string;

  /**
   * 사용자 이름.
   *
   * @minLength 1
   * @maxLength 150
   */
  @Column({ length: 150 })
  name: string;

  /**
   * 사용자 전화번호.
   *
   */
  @Column('varchar', { length: 20, nullable: true })
  phoneNumber: string | null;

  /**
   * 사용자 별명.
   *
   * @minLength 1
   * @maxLength 150
   */
  @Column('varchar', { length: 150, nullable: true })
  nickname: string | null;

  /**
   * 사용자 성별.
   */
  @Column('varchar', { nullable: true })
  gender: 'MALE' | 'FEMALE' | null;

  /**
   * 사용자 벨트(경력 또는 등급을 나타내는 필드).
   */
  @Column('varchar', { nullable: true })
  belt: string | null;

  /**
   * 사용자 체중.
   */
  @Column('float', { nullable: true })
  weight: number | null;

  // /**
  //  * 사용자 프로필 이미지 URL 키.
  //  */
  // @Column({ nullable: true })
  // profileImageUrlKey: string;

  // /**
  //  * 사용자 썸네일 이미지 URL 키.
  //  */
  // @Column({ nullable: true })
  // thumbnailImageUrlKey: string;

  /**
   * 사용자 상태. 활성, 비활성 등을 나타냅니다.
   */
  @Column('varchar', { length: 10, default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  /**
   * 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * 최종 업데이트 시간. 엔티티가 수정될 때마다 자동으로 업데이트됩니다.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
