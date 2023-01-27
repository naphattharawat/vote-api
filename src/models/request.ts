import { Knex } from 'knex'

export class RequestModel {

  saveRequest(db: Knex.QueryInterface, data: any) {
    return db.table('requests')
      .insert(data);
  }

}