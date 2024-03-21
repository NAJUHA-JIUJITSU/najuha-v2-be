import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { CompetitionEntity } from './competition.entity';
import { IEarlyBirdDiscountSnapshot } from 'src/modules/competitions/structure/earlbird-discount-snapshot.interface';

@Entity('early_bird_discount_snapshot')
export class EarlyBirdDiscountSnapshotEntity {
  /**
   * - ID. 데이터베이스에서 자동 생성됩니다.
   * @type uint32
   */
  @PrimaryGeneratedColumn()
  id: IEarlyBirdDiscountSnapshot['id'];

  /**
   * - 얼리버드 시작일
   */
  @Column('timestamp')
  earlyBirdStartDate: IEarlyBirdDiscountSnapshot['earlyBirdStartDate'];

  /**
   * - 얼리버드 마감일
   */
  @Column('timestamp')
  earlyBirdEndDate: IEarlyBirdDiscountSnapshot['earlyBirdEndDate'];

  /**
   * - 얼리버드 할인 가격 ex) 10000
   * - 단위 : 원
   * - 음수 값은 허용하지 않습니다.
   * @minimum 0
   */
  @Column('int')
  discountPrice: IEarlyBirdDiscountSnapshot['discountPrice'];

  /** - 생성 시간. 데이터베이스에 엔티티가 처음 저장될 때 자동으로 설정됩니다. */
  @CreateDateColumn()
  createdAt: IEarlyBirdDiscountSnapshot['createdAt'];

  /** - 최종 업데이트 시간. 엔티티가 수정될 때마다 자동으로 업데이트됩니다. */
  @UpdateDateColumn()
  updatedAt: IEarlyBirdDiscountSnapshot['updatedAt'];

  @ManyToOne(() => CompetitionEntity, (competition) => competition.earlyBirdDiscountSnapshots)
  competition: CompetitionEntity;
}
