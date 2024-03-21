import { ICompetition } from '../../competition.interface';
import { IEarlyBirdDiscountSnapshot } from '../../earlbird-discount-snapshot.interface';

interface CompetitionResDto extends Omit<ICompetition, 'earlyBirdDiscountStrategy' | 'divisions'> {
  earlyBirdDiscountStrategy?: Omit<IEarlyBirdDiscountSnapshot, 'competition'>;
}

export type FindCompetitionsResDto = CompetitionResDto[];
