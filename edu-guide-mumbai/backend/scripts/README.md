# Database Seed Script

This script seeds the database with test user and mock college data.

## Usage

```bash
npm run seed
```

Or directly:

```bash
node backend/scripts/seed.js
```

## What it does

1. **Creates/Updates Test User**
   - Email: `example@gmail.com`
   - Password: `123456789`
   - Role: `student`
   - Email verified: `true`

2. **Seeds Mock Colleges**
   - Creates/updates 5 sample colleges with complete data:
     - St. Xavier's College
     - HR College of Commerce and Economics
     - VJTI - Veermata Jijabai Technological Institute
     - Narsee Monjee Institute of Management Studies
     - Mithibai College
   - Links colleges to streams
   - Adds sample courses
   - Links facilities
   - Adds admission and placement information

## Requirements

- Database must be set up and running
- Environment variables must be configured in `.env`
- Database schema must be created (run `database/schema.sql` first)

## Notes

- The script is idempotent - you can run it multiple times safely
- Existing data will be updated if colleges with the same code exist
- Test user password will be updated if user already exists











