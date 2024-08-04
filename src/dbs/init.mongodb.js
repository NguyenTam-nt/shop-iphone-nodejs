"use strict"

const mongoose = require("mongoose")
const { countConnect } = require("../helpers/check.connect")
const configApp = require("../configs/config.mongodb")

const connectString = `mongodb://${configApp.db.host}:${configApp.db.port}/${configApp.db.name}`

class Database {
  constructor() {
    this.connect()
  }

  connect() {
    if (1 === 1) {
      mongoose.set("debug", true)
      mongoose.set("debug", { color: true })
    }

    mongoose
      .connect(connectString, {})
      .then(() => {
        console.log("Connect to mongodb successfully Pro")
        countConnect()
      })
      .catch(() => {
        console.log("Connect to mongodb false")
      })
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database()
    }

    return Database.instance
  }
}

const instanceMongoDB = Database.getInstance()

module.exports = instanceMongoDB
