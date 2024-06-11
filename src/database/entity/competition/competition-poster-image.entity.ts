import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { uuidv7 } from 'uuidv7';
import { CompetitionEntity } from '../competition/competition.entity';
import { ImageEntity } from '../image/image.entity';
import { ICompetitionPosterImage } from '../../../modules/competitions/domain/interface/competition-poster-image.interface';

/**
 * CompetitionPosterImage Entity
 * @namespace Competition
 * @erd Image
 */
@Entity('competition_poster_image')
export class CompetitionPosterImageEntity {
  @PrimaryColumn('uuid', { default: uuidv7() })
  id!: ICompetitionPosterImage['id'];

  @Column('uuid')
  competitionId!: ICompetitionPosterImage['competitionId'];

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

  @ManyToOne(() => ImageEntity, (image) => image.competitionProfileImages)
  @JoinColumn({ name: 'imageId' })
  image!: ImageEntity;
}
