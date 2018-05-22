const {db} = require('./db')

const seed = async () => {
  await db.sync({force: true})
  db.close()
}

seed()
