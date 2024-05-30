import { DataSource } from 'typeorm';
import { TypeormMarkdownGenerator } from 'typeorm-markdown-generator';
import appEnv from './common/app-env';

const appDataSources = new DataSource({
  type: appEnv.dbType,
  host: appEnv.dbHost,
  port: appEnv.dbPort,
  username: appEnv.dbUsername,
  password: appEnv.dbpassword,
  database: appEnv.dbDatabase,
  synchronize: appEnv.dbSynchronize,
  entities: [__dirname + '/database/entity/**/*.entity{.ts,.js}'],
});

const generateErd = async () => {
  try {
    const typeormMarkdown = new TypeormMarkdownGenerator(appDataSources, {
      entityPath: 'src/database/entity/**/*.ts',
      title: 'NAJUHA V2 ERD',
      outFilePath: 'docs/najiha-v2-erd.md',
      indexTable: true,
    });
    await typeormMarkdown.build();
    console.log('Document generated successfully.');
  } catch (error) {
    console.error('Error generating document:', error);
  }
};

generateErd();
