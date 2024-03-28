import { PaymentSnapshot } from 'src/modules/competitions/domain/entities/payment-snapshot.entity';

export interface IExpectedPayment {
  normalAmount: PaymentSnapshot['normalAmount'];
  earlybirdDiscountAmount: PaymentSnapshot['earlybirdDiscountAmount'];
  combinationDiscountAmount: PaymentSnapshot['combinationDiscountAmount'];
  totalAmount: PaymentSnapshot['totalAmount'];
}
