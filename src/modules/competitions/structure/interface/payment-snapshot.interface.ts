import { PaymentSnapshot } from '../../domain/entities/payment-snapshot.entity';

export interface IPaymentSnapshot extends Omit<PaymentSnapshot, 'application'> {}
