import { Module, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import FakeToss from 'fake-toss-payments-server';

@Module({})
export class FakeTossModule implements OnModuleInit, OnModuleDestroy {
  private fakeTossBackend: FakeToss.FakeTossBackend;

  constructor() {
    this.fakeTossBackend = new FakeToss.FakeTossBackend();
  }

  async onModuleInit() {
    FakeToss.FakeTossConfiguration.WEBHOOK_URL = 'http://your-backend-webhook-url';
    FakeToss.FakeTossConfiguration.authorize = (token) => token === 'test_ak_ZORzdMaqN3wQd5k6ygr5AkYXQGwy';
    await this.fakeTossBackend.open();
    console.log('FakeToss server is running');
  }

  async onModuleDestroy() {
    await this.fakeTossBackend.close();
    console.log('FakeToss server is closed');
  }
}
