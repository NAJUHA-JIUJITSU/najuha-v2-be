import { Application } from '../../domain/entities/application.entity';

export interface IApplication
  extends Omit<
    Application,
    | 'playerSnapshots'
    | 'paymentSnapshots'
    | 'participationDivisions'
    | 'earlybirdDiscountSnapshot'
    | 'combinationDiscountSnapshot'
    | 'competition'
    | 'user'
  > {}
