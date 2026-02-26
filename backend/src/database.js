import { Sequelize } from 'sequelize';

// NODE_ENV=test  → SQLite in-memory  (fast, isolated, used by Vitest)
// no DB_HOST set → SQLite file       (local dev and E2E tests — no MySQL needed)
// DB_HOST set    → MySQL             (production)
const isTest = process.env.NODE_ENV === 'test';
const useMySQL = process.env.DB_HOST && !isTest;

const sequelize = useMySQL
  ? new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      logging: false,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: isTest ? ':memory:' : './notes.db',
      logging: false,
    });

export default sequelize;
