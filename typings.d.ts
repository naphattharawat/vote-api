import { Knex } from 'knex'

declare module 'express' {
  interface Request {
    db: any // Actually should be something like `multer.Body`
    knex: Knex.QueryInterface,
    decoded: any // Actually should be something like `multer.Files`
  }
}