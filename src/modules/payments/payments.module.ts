import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { PaymentsAppService } from './application/payments.app.service';

@Module({
  imports: [DatabaseModule],
  providers: [PaymentsAppService],
})
export class PaymentsModule {}
