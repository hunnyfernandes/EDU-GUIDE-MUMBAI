const { promisePool } = require('../config/database');
require('dotenv').config();

const updateSchema = async () => {
    try {
        console.log('🔧 Starting schema update for State/City support...');

        // 1. Check/Add 'state' column
        const [stateColumn] = await promisePool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'colleges' AND COLUMN_NAME = 'state'
        `, [process.env.DB_NAME || 'edu_guide_mumbai']);

        if (stateColumn.length === 0) {
            console.log('   Adding "state" column...');
            await promisePool.query(`
                ALTER TABLE colleges 
                ADD COLUMN state VARCHAR(100) DEFAULT 'Maharashtra' AFTER address
            `);
            console.log('   ✅ Added "state" column');
        } else {
            console.log('   ℹ️  "state" column already exists');
        }

        // 2. Check/Add 'city' column
        const [cityColumn] = await promisePool.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'colleges' AND COLUMN_NAME = 'city'
        `, [process.env.DB_NAME || 'edu_guide_mumbai']);

        if (cityColumn.length === 0) {
            console.log('   Adding "city" column...');
            await promisePool.query(`
                ALTER TABLE colleges 
                ADD COLUMN city VARCHAR(100) DEFAULT 'Mumbai' AFTER state
            `);
            console.log('   ✅ Added "city" column');
        } else {
            console.log('   ℹ️  "city" column already exists');
        }

        // 3. Update existing records if they have null values
        console.log('   Updating null values...');
        await promisePool.query(`
            UPDATE colleges 
            SET state = 'Maharashtra' 
            WHERE state IS NULL OR state = ''
        `);
        await promisePool.query(`
            UPDATE colleges 
            SET city = 'Mumbai' 
            WHERE city IS NULL OR city = ''
        `);
        console.log('   ✅ Updated existing records defaults');

        console.log('🎉 Schema update completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Schema update failed:', error);
        process.exit(1);
    }
};

updateSchema();
