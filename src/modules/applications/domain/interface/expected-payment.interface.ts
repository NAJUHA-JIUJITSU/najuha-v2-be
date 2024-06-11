import { IPaymentSnapshot } from '../../../competitions/domain/interface/payment-snapshot.interface';

export interface IExpectedPayment {
  normalAmount: IPaymentSnapshot['normalAmount'];
  earlybirdDiscountAmount: IPaymentSnapshot['earlybirdDiscountAmount'];
  combinationDiscountAmount: IPaymentSnapshot['combinationDiscountAmount'];
  totalAmount: IPaymentSnapshot['totalAmount'];
}
