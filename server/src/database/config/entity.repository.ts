import { Injectable } from '@nestjs/common';
import { Model, Document, FilterQuery, ClientSession ,UpdateQuery,AnyBulkWriteOperation, AggregateOptions, PipelineStage} from 'mongoose';

export class EntityRepository<T extends Document> {
  constructor(protected entityModel: Model<T>) {}

  async findOne(
    filterQuery: FilterQuery<T>,
    projection: Record<string, any> = { __v: 0 },
    transaction: ClientSession = null,
  ): Promise<T> {
    return this.entityModel
      .findOne(filterQuery, { __v: 0, ...projection })
      .session(transaction)
      .exec();
  }

  async find(
    filterQuery: FilterQuery<T>,
    projection: Record<string, any> = { __v: 0 },
    transaction: ClientSession = null,
  ): Promise<T[] | null> {
    return this.entityModel
      .find(filterQuery, { __v: 0, ...projection })
      .session(transaction)
      .exec();
  }

  async create(
    createEntityData?: unknown,
    transaction: ClientSession = null,
  ): Promise<T> {
    return new this.entityModel(createEntityData).save({
      session: transaction,
    });
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    updateQuery:UpdateQuery<unknown>,
    transaction: ClientSession = null,
    upsert:boolean=false
  ): Promise<T | null> {
    return this.entityModel
      .findOneAndUpdate(filterQuery,updateQuery,{new:true,upsert})
      .session(transaction)
      .exec();
  }

  async insertMany(
    docs: T[],
    updateQuery:UpdateQuery<unknown>,
    transaction: ClientSession = null,
    upsert:boolean=false
  ): Promise<T[] | null> {
    return this.entityModel.insertMany(docs,{session:transaction})
  }

  async deleteMany(
    filterQuery: FilterQuery<T>,
    transaction: ClientSession = null,

  ): Promise<number> {
  const resp=  await this.entityModel.deleteMany(filterQuery,{session:transaction})
    return  resp.deletedCount

  }


  async bulkWriteMany(
    updateOperation: AnyBulkWriteOperation[],
    transaction: ClientSession = null,
  ): Promise<unknown| null> {
    return this.entityModel.bulkWrite(updateOperation,{session:transaction})
  }

  async aggregate(
    pipelineStages:PipelineStage[],
    aggregationOption?: AggregateOptions,
  ): Promise<unknown| null> {
    return this.entityModel.aggregate(pipelineStages,aggregationOption)
  }
}
