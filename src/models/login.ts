import { Knex } from 'knex'
import axios from 'axios';

export class Login {

  loginMyMOPH(code) {
    const options = {
      method: 'POST',
      url: 'https://auth.moph.go.th/v1/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'https://dev.moph.go.th/vote/callbackmymoph',
        client_id: process.env.MYMOPH_CLIENT_ID,
        client_secret: process.env.MYMOPH_CLIENT_SECRET,
      }
    };
    return new Promise((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, error: error.response.data });
      });
    });

  }

  getProfileMyMOPH(token) {
    const request = require('request');
    const options = {
      method: 'GET',
      url: 'https://members.moph.go.th/api/v1/info',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      }
    };
    return new Promise((resolve, reject) => {
      axios(options).then(function (response) {
        resolve({ statusCode: response.status, body: response.data });
      }).catch(function (error) {
        resolve({ statusCode: error.response.status, error: error.response.data });
      });
    })

  }

  loginThaid(code) {
    try {
      const authorization = Buffer.from(`${process.env.THAID_CLIENT_ID}:${process.env.THAID_CLIENT_SECRET}`).toString('base64');

      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'https://dev.moph.go.th/vote/callbackthaid'
      }
      const options = {
        method: 'POST',
        url: 'https://imauth.bora.dopa.go.th/api/v2/oauth2/token/',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authorization}`
        },
        data: data
      };
      console.log(options);
      return new Promise((resolve, reject) => {
        axios(options).then(function (response) {
          resolve({ statusCode: response.status, body: response.data });
        }).catch(function (error) {
          resolve({ statusCode: error.response.status, error: error.response.data });
        });
      })
    } catch (error) {
      console.log(error);
      return error;
    }

  }
}