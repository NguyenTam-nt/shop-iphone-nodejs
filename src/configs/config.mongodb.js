const dev = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    port: process.env.DEV_DB_PORT,
    host: process.env.DEV_DB_HOST,
    name: process.env.DEV_DB_NAME,
  },
}

const pro = {
  app: {
    port: process.env.PORT || 3000,
  },
  db: {
    port: process.env.PRO_DB_PORT,
    host: process.env.PRO_DB_HOST,
    name: process.env.PRO_DB_NAME,
  },
}

const config = { dev, pro }

module.exports = config[process.env.NODE_ENV || "dev"]
