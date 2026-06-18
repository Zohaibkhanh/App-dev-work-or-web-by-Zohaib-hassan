// src/config/createTables.js
const db = require('./database');

async function createTables() {
  try {
    await db.connect();
    console.log('📦 Creating HealthVault tables...');
    
    // USERS TABLE
    await db.execute(`
      CREATE TABLE users (
        user_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        name VARCHAR2(100) NOT NULL,
        email VARCHAR2(100) UNIQUE NOT NULL,
        password_hash VARCHAR2(255) NOT NULL,
        blood_type VARCHAR2(5),
        phone_number VARCHAR2(20),
        date_of_birth DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created: users table');
    
    // MEDICAL RECORDS TABLE
    await db.execute(`
      CREATE TABLE medical_records (
        record_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
        title VARCHAR2(200) NOT NULL,
        record_type VARCHAR2(50) NOT NULL,
        description CLOB,
        doctor_name VARCHAR2(100),
        hospital VARCHAR2(200),
        record_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created: medical_records table');
    
    // EMERGENCY CONTACTS
    await db.execute(`
      CREATE TABLE emergency_contacts (
        contact_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        user_id NUMBER REFERENCES users(user_id) ON DELETE CASCADE,
        contact_name VARCHAR2(100) NOT NULL,
        relationship VARCHAR2(50),
        phone_number VARCHAR2(20) NOT NULL,
        is_primary CHAR(1) DEFAULT 'N',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created: emergency_contacts table');
    
    console.log('🎉 ALL TABLES CREATED SUCCESSFULLY!');
    await db.connection.close();
    
  } catch (error) {
    console.error('❌ Table creation failed:', error.message);
    
    // If tables already exist, that's OK
    if (error.message.includes('already exists')) {
      console.log('📝 Tables already exist - continuing...');
    } else {
      throw error;
    }
  }
}

// Run immediately
createTables();