// src/config/database.js
const oracledb = require('oracledb');
require('dotenv').config();

class Database {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      console.log('🔌 Connecting to Oracle with password: dbpro');
      
      this.connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONNECTION_STRING
      });
      
      console.log('✅ Connected to Oracle!');
      return this.connection;
      
    } catch (error) {
      console.error('❌ Connection failed:', error.message);
      throw error;
    }
  }

  async execute(sql, params = {}, options = {}) {
    try {
      const result = await this.connection.execute(sql, params, {
        autoCommit: true,
        ...options
      });
      return result;
    } catch (error) {
      console.error('❌ Query error:', error.message);
      throw error;
    }
  }
}

module.exports = new Database();