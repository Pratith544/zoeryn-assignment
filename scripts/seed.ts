import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';
import FinancialRecord from '../models/FinancialRecord';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/finance_dashboard';

const categories = [
  'Salary',
  'Rent',
  'Food',
  'Utilities',
  'Transport',
  'Healthcare',
  'Entertainment',
  'Freelance',
  'Investment',
  'Other',
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAmount(): number {
  return Math.floor(Math.random() * (100000 - 1000 + 1)) + 1000;
}

function getRandomDate(daysAgo: number = 180): Date {
  const now = new Date();
  const random = Math.floor(Math.random() * daysAgo);
  return new Date(now.getTime() - random * 24 * 60 * 60 * 1000);
}

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing users and records
    console.log('🗑️  Clearing existing users and records...');
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    console.log('✓ Existing data cleared');

    // Create users with manually hashed passwords
    console.log('👤 Creating users with hashed passwords...');

    const adminHash = await bcrypt.hash('Admin@1234', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@finance.com',
      passwordHash: adminHash,
      role: 'admin',
      status: 'active',
    });
    console.log(`  ✓ Created admin: ${admin.email}`);

    const analystHash = await bcrypt.hash('Analyst@1234', 12);
    const analyst = await User.create({
      name: 'Analyst User',
      email: 'analyst@finance.com',
      passwordHash: analystHash,
      role: 'analyst',
      status: 'active',
    });
    console.log(`  ✓ Created analyst: ${analyst.email}`);

    const viewerHash = await bcrypt.hash('Viewer@1234', 12);
    const viewer = await User.create({
      name: 'Viewer User',
      email: 'viewer@finance.com',
      passwordHash: viewerHash,
      role: 'viewer',
      status: 'active',
    });
    console.log(`  ✓ Created viewer: ${viewer.email}`);

    const createdUsers = [admin, analyst, viewer];

    // Create 30 financial records
    console.log('💰 Creating 30 financial records...');
    const records = [];

    for (let i = 0; i < 30; i++) {
      const isIncome = i % 2 === 0; // Alternating income and expense
      const type = isIncome ? 'income' : 'expense';

      records.push({
        amount: getRandomAmount(),
        type,
        category: getRandomElement(categories),
        date: getRandomDate(),
        notes: Math.random() > 0.6 ? `Sample note for record ${i + 1}` : undefined,
        createdBy: admin._id,
        isDeleted: false,
      });
    }

    const createdRecords = await FinancialRecord.insertMany(records);
    console.log(`✓ Created ${createdRecords.length} financial records`);

    // Summary
    const incomeCount = createdRecords.filter((r) => r.type === 'income').length;
    const expenseCount = createdRecords.filter((r) => r.type === 'expense').length;
    const totalIncome = createdRecords
      .filter((r) => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = createdRecords
      .filter((r) => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);

    console.log('\n📊 === Seeding Summary ===');
    console.log(`Users created: ${createdUsers.length}`);
    console.log(`Records created: ${createdRecords.length}`);
    console.log(`  - Income records: ${incomeCount} (Total: $${totalIncome.toFixed(2)})`);
    console.log(`  - Expense records: ${expenseCount} (Total: $${totalExpense.toFixed(2)})`);
    console.log(`Net: $${(totalIncome - totalExpense).toFixed(2)}`);

    await mongoose.disconnect();
    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedDatabase();
