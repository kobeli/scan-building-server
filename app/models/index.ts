import { dbConfig } from '../config/db.config';
import { Sequelize } from 'sequelize';
import { Photo } from './photo.model';

export const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

export const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  photos: Photo(sequelize, Sequelize)
};
