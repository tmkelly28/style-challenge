const Sequelize = require('sequelize')
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/simple-voter', {
  logging: false
})

const Entry = db.define('entry', {
  content: Sequelize.STRING,
  votes: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

module.exports = {Entry, db}
