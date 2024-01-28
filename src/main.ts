import * as cors from 'cors';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from 'src/app.module';
import { SwaggerSetting } from 'src/swagger-setting';
import appConfig from 'src/common/appConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(cors()); // TODO: cors 설정 옵션 확인하기

  SwaggerSetting(app);

  await app.listen(appConfig.appPort);
}
bootstrap();
