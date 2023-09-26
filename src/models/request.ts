import { Knex } from 'knex'

export class RequestModel {

  getCandidate(db: Knex.QueryInterface) {
    return db.table('candidate').orderBy('id');
  }
  getVote(db: Knex.QueryInterface, cid) {
    return db.table('single').where('cid', cid);
  }

  getVoteCom(db: Knex.QueryInterface, sid) {
    return db.table('single_committee').where('session_id', sid);
  }
  getVoteTeam(db: Knex.QueryInterface, sid) {
    return db.table('team').where('session_id', sid);
  }

  saveVote(db: Knex.QueryInterface, data: any) {
    return db.table('single')
      .insert(data).onConflict().merge(['candidate_id']);
  }

  saveVoteCom(db: Knex.QueryInterface, data: any) {
    return db.table('single_committee')
      .insert(data);
  }

  removeVoteCom(db: Knex.QueryInterface, sessionId: any) {
    return db.table('single_committee')
      .del().where('session_id', sessionId);
  }
  removeVoteTeam(db: Knex.QueryInterface, sessionId: any) {
    return db.table('team')
      .del().where('session_id', sessionId);
  }
  saveVoteTeam(db: Knex.QueryInterface, data: any) {
    return db.table('team')
      .insert(data)
  }

  scoreSingle(db: any) {
    return db.table('candidate as c')
      .select('c.*', 's.count', 'sc.score',
        db.raw('ifnull(s.count,0)+ifnull(sc.score,0) as sum_score'))
      .leftJoin('view_single as s', 'c.id', 's.id')
      .leftJoin('view_single_com as sc', 'c.id', 'sc.id')
      .orderBy('sum_score', 'desc')
  }
  scoreTeam(db: any) {
    return db.table('team as t')
      .select('t.*',db.raw('sum(score_head+score_team) as score')).sum('score_head as score_head').sum('score_team as score_team')
      .orderBy('score', 'desc')
      .groupBy('t.name')
  }

}