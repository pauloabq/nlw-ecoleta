// Arquivo gerado com o comando: npx knex init (gera o arquivo knex.js. renomeado para knex.ts)

// Update with your config settings.
import path from 'path'

// não suporta exports default
module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      // __dirname: constante com o diretório atual / path: padronização de caminho (ex: database\database.sqlite)
      filename: path.resolve(__dirname, 'src', 'database', './database.sqlite')
    },
    migrations:{
        directory : path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds:{
        directory : path.resolve(__dirname, 'src', 'database', 'seeds')
    },
    useNullAsDefault : true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
