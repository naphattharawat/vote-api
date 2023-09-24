/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';

import * as express from 'express';
import { Router, Request, Response } from 'express';

import { RequestModel } from '../models/request';

const requestModel = new RequestModel();
const router: Router = Router();


router.get('/candidate', async (req: Request, res: Response) => {
  try {
    const rs: any = await requestModel.getCandidate(req.db);
    res.send({ ok: true, rows: rs });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.get('/single', async (req: Request, res: Response) => {
  try {
    const rs: any = await requestModel.getVote(req.db, req.decoded.cid);
    if(rs.length){
      res.send({ ok: true, rows: rs });
    }else{
      res.send({ ok: true, rows: [] });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

router.post('/single', async (req: Request, res: Response) => {
  const id = req.body.id;
  try {
    await requestModel.saveVote(req.db, {
      cid: req.decoded.cid,
      candidate_id: id
    });
    res.send({ ok: true, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }
});

export default router;