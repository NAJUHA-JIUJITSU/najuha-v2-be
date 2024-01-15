import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './swagger/swagger-setting';
import * as cors from 'cors';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(cors()); // TODO: cors 설정 옵션 확인하기

  SwaggerSetting(app);

  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  console.log(`${process.env.NODE_ENV}.env`);

  console.log('process.env.DB_HOST', process.env.DB_HOST);

  await app.listen(3001);
}
bootstrap();
