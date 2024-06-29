import { TMoney } from '../../../../common/common-types';

export interface IExpectedPayment {
  normalAmount: TMoney;
  earlybirdDiscountAmount: TMoney;
  combinationDiscountAmount: TMoney;
  totalAmount: TMoney;
}
