/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { Login } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new Login();
const jwt = new Jwt();

const router: Router = Router();

router.post('/mymoph', async (req: Request, res: Response) => {
  let code: string = req.body.code;
  let db = req.db;
  try {
    // let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let rs: any = await loginModel.loginMyMOPH(code);
    console.log(rs);
    console.log(rs.body.access_token);

    if (rs.body.access_token) {
      const info: any = await loginModel.getProfileMyMOPH(rs.body.access_token);
      console.log(info);

      if (info.ok) {
        const obj = {
          cid: info.user.CID
        }
        let token = jwt.sign(obj);
        res.send({ ok: true, token: token });
      } else {
        res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
      }
    } else {
      res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
});

router.post('/thaid', async (req: Request, res: Response) => {
  const code = req.body.code;
  const state = req.body.state;
  try {
    if (code && state) {
      const rs: any = await loginModel.loginThaid(code);
      // console.log('requestToken', rs);
      if (rs.statusCode == 200) {
        if (rs.body.pid) {
          const obj = {
            cid: rs.body.pid
          }
          let token = jwt.sign(obj);
          res.send({ ok: true, token: token });
        } else {
          res.status(500);
          res.send({ ok: false, error: 'ไม่พบข้อมูล' })
        }
      } else {
        res.status(500);
        res.send({ ok: false, error: 'get result ไม่ได้' })
      }
    } else {
      res.status(500);
      res.send({ ok: false, error: 'ไม่พบ sessionId' })
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send({ ok: false, error: error.message })
  }
});

export default router;