import * as express from 'express';
import { Router, Request, Response } from 'express';
import { Jwt } from '../models/jwt';

import * as HttpStatus from 'http-status-codes';
import { RequestModel } from '../models/request';

const jwt = new Jwt();

const router: Router = Router();
const requestModel = new RequestModel();
router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/votec/single-committee', async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId;
    console.log(sessionId);
    const rs: any = await requestModel.getVoteCom(req.db, sessionId);
    console.log(rs);

    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.get('/votec/team', async (req: Request, res: Response) => {
  try {
    const sessionId = req.query.sessionId;
    const rs: any = await requestModel.getVoteTeam(req.db, sessionId);
    console.log(rs);

    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.get('/votec/candidate', async (req: Request, res: Response) => {
  try {
    const rs: any = await requestModel.getCandidate(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.post('/votec/single-committee', async (req: Request, res: Response) => {
  const sessionId = req.body.sessionId;
  const data = req.body.data;
  try {
    const insert = [];
    for (const d of data) {
      if (d.score) {

        insert.push({
          session_id: sessionId,
          candidate_id: d.id,
          score: d.score
        })
      }
    }
    await requestModel.removeVoteCom(req.db, sessionId);
    await requestModel.saveVoteCom(req.db, insert);
    res.send({ ok: true, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.post('/votec/team', async (req: Request, res: Response) => {
  const sessionId = req.body.sessionId;
  const data = req.body.data;
  try {
    const insert = [];
    for (const d of data) {
      insert.push({
        session_id: sessionId,
        name: d.name,
        score_team: d.score_team,
        score_head: d.score_head
      })

    }
    await requestModel.removeVoteTeam(req.db, sessionId);
    await requestModel.saveVoteTeam(req.db, insert);
    res.send({ ok: true, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.get('/score/single', async (req: Request, res: Response) => {
  const sessionId = req.body.sessionId;
  const data = req.body.data;
  try {
    const rs: any = await requestModel.scoreSingle(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.get('/score/team', async (req: Request, res: Response) => {
  const sessionId = req.body.sessionId;
  const data = req.body.data;
  try {
    const rs: any = await requestModel.scoreTeam(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.put('/img', async (req: Request, res: Response) => {
  const id = req.body.id;
  const url = req.body.url;
  try {
    await requestModel.updateCandidate(req.db, id, url);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});
export default router;