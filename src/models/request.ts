import { Knex } from 'knex'

export class RequestModel {

  getCandidate(db: Knex.QueryInterface) {
    return db.table('candidate').orderBy('id');
  }
  getVote(db: Knex.QueryInterface, cid) {
    return db.table('single').where('cid', cid);
  }

  saveVote(db: Knex.QueryInterface, data: any) {
    return db.table('single')
      .insert(data).onConflict().merge(['candidate_id']);
  }

}