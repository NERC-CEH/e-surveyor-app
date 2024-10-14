import SQLiteDatabase from '@flumens/models/dist/Stores/SQLiteDatabase';
import { db } from 'common/models/store';

export default async () => {
  console.log('SQLite migrate: START');
  try {
    await SQLiteDatabase.migrateCordova();
    console.log('SQLite migrate: file moved');

    await db.init();
    console.log('SQLite migrate: db initialised');

    await db.query({
      sql: `CREATE TABLE IF NOT EXISTS main
      (
            id         VARCHAR(36),
            cid        VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT id,
            data       JSONB                   NOT NULL,
            created_at INTEGER                 NOT NULL,
            updated_at INTEGER                 NOT NULL,
            synced_at  INTEGER
      );`,
    });
    await db.query({
      sql: `INSERT INTO main (id, cid, data, created_at, updated_at, synced_at)
        SELECT json(value) ->> "$.id",
              key,
              COALESCE(json(value)->>"$.attrs", "{}"),
              COALESCE(json(value) ->> "$.metadata.createdOn", CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
              COALESCE(json(value) ->> "$.metadata.updatedOn", CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
              json(value) ->> "$.metadata.syncedOn"
        FROM generic;
    `,
    });
    console.log('SQLite migrate: main migrated');

    await db.query({
      sql: `CREATE TABLE IF NOT EXISTS samples
        (
            id         VARCHAR(36),
            cid        VARCHAR(36) PRIMARY KEY NOT NULL DEFAULT id,
            data       JSONB                   NOT NULL,
            created_at INTEGER                 NOT NULL,
            updated_at INTEGER                 NOT NULL,
            synced_at  INTEGER
      );`,
    });

    await db.query({
      sql: `INSERT INTO samples (id, cid, data, created_at, updated_at, synced_at)
        SELECT
              json(value) ->> "$.id",
              key,
              json(value),
              COALESCE(json(value) ->> "$.metadata.createdOn", CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
              COALESCE(json(value) ->> "$.metadata.updatedOn", CAST((julianday('now') - 2440587.5)*86400000 AS INTEGER)),
              json(value) ->> "$.metadata.syncedOn"
        FROM models
        ORDER BY id DESC
        LIMIT 1000;`,
    });
    console.log('SQLite migrate: samples migrated');
  } catch (error) {
    console.error(error);
    console.log('SQLite migrate: error');
    throw error;
  }

  console.log('SQLite migrate: FINISH');
};
