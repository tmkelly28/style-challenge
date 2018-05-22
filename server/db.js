const Sequelize = require('sequelize')
const db = new Sequelize(`postgres://localhost/${process.env.DATABASE_URL || 'simple-voter'}`, {
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
