import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ApplicationEntity } from '../entity/application/application.entity';

@Injectable()
export class ApplicationRepository extends Repository<ApplicationEntity> {
  constructor(private dataSource: DataSource) {
    super(ApplicationEntity, dataSource.createEntityManager());
  }

  // try 1
  // async executeTransaction(operations: Array<() => Promise<any>>): Promise<void> {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //   try {
  //     for (const operation of operations) {
  //       await operation();
  //     }
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  // try 2
  // async executeTransaction(operations: Array<(manager: EntityManager) => Promise<void>>): Promise<void> {
  //   await this.dataSource.transaction(async (transactionalEntityManager) => {
  //     for (const operation of operations) {
  //       await operation(transactionalEntityManager);
  //     }
  //   });
  // }

  // try 3
  // async executeTransaction(operations: Array<(manager: EntityManager) => Promise<void>>): Promise<void> {
  //   await this.dataSource.transaction(async (transactionalEntityManager) => {
  //     for (const operation of operations) {
  //       await operation(transactionalEntityManager);
  //     }
  //   });
  // }
}
