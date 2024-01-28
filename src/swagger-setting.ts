import { readFileSync } from 'fs';
import * as path from 'path';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

export const SwaggerSetting = (app: INestApplication) => {
  const swaagerConfig = readFileSync(
    path.join(__dirname, '../../src/swagger.json'),
    'utf8',
  );
  SwaggerModule.setup('api', app, JSON.parse(swaagerConfig));
};
