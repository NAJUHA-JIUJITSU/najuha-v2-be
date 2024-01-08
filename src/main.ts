import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerSetting } from './configs/swagger-setting';
import { HttpErrorFilter } from './common/exeption-filter';
import * as cors from 'cors';
// import { WinstonLogger } from './common/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create(AppModule, {
  //   logger: new WinstonLogger(),
  // });

  app.use(cors()); // TODO: cors 설정 옵션 확인하기

  SwaggerSetting(app);

  app.useGlobalFilters(new HttpErrorFilter());

  await app.listen(3000);
}
bootstrap();
