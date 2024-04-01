import { IPaymentSnapshot } from 'src/modules/competitions/domain/structure/payment-snapshot.interface';

export interface IExpectedPayment {
  normalAmount: IPaymentSnapshot['normalAmount'];
  earlybirdDiscountAmount: IPaymentSnapshot['earlybirdDiscountAmount'];
  combinationDiscountAmount: IPaymentSnapshot['combinationDiscountAmount'];
  totalAmount: IPaymentSnapshot['totalAmount'];
}
