import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CompetitionEntity } from '../competition/competition.entity';
import { ImageEntity } from '../image/image.entity';
import { ICompetitionPosterImage } from '../../../modules/competitions/domain/interface/competition-poster-image.interface';

/**
 * CompetitionPosterImage.
 *
 * - 실제 이미지에 대한 정보는 Image Entity를 통해 관리합니다.
 * - 해당 Entity는 대회 포스터 이미지와 대회를 매핑하는 역할을 합니다.
 * @namespace Competition
 * @erd Image
 */
@Entity('competition_poster_image')
export class CompetitionPosterImageEntity {
  /** UUID v7. */
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICompetitionPosterImage['id'];

  /** competitionId */
  @Column('uuid')
  competitionId!: ICompetitionPosterImage['competitionId'];

  /**
   * imageId
   * - u-9-1 createImage 로 생성된 image의 id
   */
  @Column('uuid')
  imageId!: ICompetitionPosterImage['imageId'];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: ICompetitionPosterImage['createdAt'];

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt!: ICompetitionPosterImage['deletedAt'];

  // ------------------------------------------------------------
  // Relations
  // ------------------------------------------------------------
  @ManyToOne(() => CompetitionEntity, (competition) => competition.competitionPosterImages)
  @JoinColumn({ name: 'competitionId' })
  competition!: CompetitionEntity;

  @ManyToOne(() => ImageEntity, (image) => image.competitionPosterImages)
  @JoinColumn({ name: 'imageId' })
  image!: ImageEntity;
}
