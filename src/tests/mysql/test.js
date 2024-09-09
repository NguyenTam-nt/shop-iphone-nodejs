const mysql = require("mysql2")

const pool = mysql.createPool({
  host: "localhost",
  port: "8811",
  user: "root",
  password: "nguyentam",
  database: "database_test",
})

const batchSize = 100000 // 100000
const totalSize = 10_000_000 //1_000_000

let currentId = 1
console.time("-----TIME-START-----")
const insertBatch = () => {
  const array = []
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`
    const address = `address-${currentId}`
    const email = `email-${currentId}`
    array.push([currentId, name, email, address])
    currentId++
  }

  if (!array.length) {
    console.timeEnd("-----TIME-END-----")

    pool.end((err) => {
      if (err) {
        console.log("error occurred while running batch")
      } else {
        console.log("Connection pool closed successfully")
      }
    })
    return
  }

  const SQL = `INSERT INTO test (id, name, email, address) VALUES ?`

  pool.query(SQL, [array], async (err, result) => {
    if (err) throw err

    console.log(`inserted: ${result.affectedRows} records`)
    await insertBatch()
  })
}

insertBatch()
