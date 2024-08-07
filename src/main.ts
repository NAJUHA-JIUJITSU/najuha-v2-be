import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { SwaggerSetting } from './swagger-setting';
import appEnv from './common/app-env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.use(cors()); // todo!: cors 설정 옵션 확인하기
  SwaggerSetting(app);
  await app.listen(appEnv.appPort);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
