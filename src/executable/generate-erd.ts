import { typeOrmConfig } from 'src/database/typeorm.config';
import { DataSource } from 'typeorm';
import { TypeormMarkdownGenerator } from 'typeorm-markdown-generator';

const entityPath = 'src/database/entity/**/*.entity.ts';
const AppDataSource = new DataSource(typeOrmConfig);

const main = async () => {
  const typeormMarkdown = new TypeormMarkdownGenerator(AppDataSource, entityPath);
  typeormMarkdown
    .build('erd.md')
    .then(() => {
      console.log('Document generated successfully.');
    })
    .catch((error) => {
      console.error('Error generating document:', error);
    });
};

main();
