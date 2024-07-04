import { TMoneyValue } from '../../../../common/common-types';

export interface IExpectedPayment {
  normalAmount: TMoneyValue;
  earlybirdDiscountAmount: TMoneyValue;
  combinationDiscountAmount: TMoneyValue;
  totalAmount: TMoneyValue;
}
