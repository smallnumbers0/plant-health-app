/**
 * Create Test User Script
 *
 * This script creates a test user account in Supabase
 * Usage: node create-test-user.js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uztehmamkyawmbghtncz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dGVobWFta3lhd21iZ2h0bmN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMzMwNjAsImV4cCI6MjA3NjkwOTA2MH0.AfKgkcBLSl-qE-tMbnVIfyU8rc8JwSLA1nP1CtDOH30';

const supabase = createClient(supabaseUrl, supabaseKey);

const testUsers = [
  {
    email: 'demo@plantapp.com',
    password: 'demo123456',
    name: 'Demo User',
  },
  {
    email: 'test@test.com',
    password: 'test123456',
    name: 'Test User',
  }
];

async function createTestUser(email, password, name) {
  console.log(`\n🌱 Creating test user: ${email}`);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }

    if (data?.user?.identities?.length === 0) {
      console.log(`⚠️  User already exists: ${email}`);
      console.log(`   You can log in with this account!`);
      return;
    }

    console.log(`✅ User created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);

    if (data?.user?.email_confirmed_at) {
      console.log(`   Status: Email confirmed ✓`);
    } else {
      console.log(`   Status: Email confirmation required`);
      console.log(`   Note: Check Supabase Auth settings to disable email confirmation for testing`);
    }
  } catch (err) {
    console.error(`❌ Unexpected error:`, err.message);
  }
}

async function main() {
  console.log('🚀 Creating test accounts...\n');
  console.log('These test accounts can be used to log into the app:');

  for (const user of testUsers) {
    await createTestUser(user.email, user.password, user.name);
  }

  console.log('\n📋 Test Accounts Summary:');
  console.log('━'.repeat(50));
  testUsers.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${user.password}`);
    console.log('━'.repeat(50));
  });

  console.log('\n💡 To log in:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:5173');
  console.log('3. Click "Already have an account? Sign in"');
  console.log('4. Use one of the test accounts above');
  console.log('\n✨ Happy testing!');
}

main();
