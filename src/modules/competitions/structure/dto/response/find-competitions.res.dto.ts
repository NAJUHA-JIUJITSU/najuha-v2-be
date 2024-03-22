import { ICompetition } from '../../competition.interface';
import { IEarlybirdDiscountSnapshot } from '../../earlbird-discount-snapshot.interface';

interface CompetitionResDto extends Omit<ICompetition, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<IEarlybirdDiscountSnapshot, 'competition'>;
}

export type FindCompetitionsResDto = CompetitionResDto[];
