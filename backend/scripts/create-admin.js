#!/usr/bin/env node

/**
 * Script to create an admin account for the Education Bridge system
 * Usage: node scripts/create-admin.js --email admin@example.com --password YourPassword123 --firstName Admin --lastName User
 * 
 * Make sure to set ADMIN_SECRET_KEY in your .env file before running this script
 */

import dotenv from 'dotenv';
import axios from 'axios';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    if (value) {
      options[key] = value;
    }
  }
  
  return options;
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const createAdmin = async (adminData) => {
  try {
    console.log('\n📝 Creating admin account...\n');
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/create-admin`,
      {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        password: adminData.password,
      },
      {
        headers: {
          'X-Admin-Secret': ADMIN_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      const user = response.data.data.user;
      const token = response.data.data.token;
      
      console.log('\n✅ Admin account created successfully!\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`Email:     ${user.email}`);
      console.log(`Name:      ${user.firstName} ${user.lastName}`);
      console.log(`Role:      ${user.role}`);
      console.log(`User ID:   ${user.id}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🔐 Authentication Token:');
      console.log(token);
      console.log('\n💡 You can now log in with these credentials.\n');
      
      return user;
    }
  } catch (error) {
    if (error.response) {
      console.error('\n❌ Error creating admin account:\n');
      console.error(`Status: ${error.response.status}`);
      console.error(`Message: ${error.response.data.message}`);
      
      if (error.response.status === 409) {
        console.error('\n💡 This email is already registered. Try a different email.');
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n❌ Error: Could not connect to the API server.');
      console.error(`Make sure the server is running at ${API_BASE_URL}`);
    } else {
      console.error('\n❌ Error:', error.message);
    }
    process.exit(1);
  }
};

const main = async () => {
  console.log('\n🔐 Education Bridge - Admin Account Creator\n');
  
  // Check if ADMIN_SECRET_KEY is set
  if (!ADMIN_SECRET) {
    console.error('❌ Error: ADMIN_SECRET_KEY is not set in your .env file.');
    console.error('Please set ADMIN_SECRET_KEY before running this script.\n');
    console.error('📋 To generate a secure key, run:');
    console.error('   openssl rand -hex 32\n');
    process.exit(1);
  }

  // Parse command line arguments
  const options = parseArgs();
  
  let adminData = {
    email: options.email,
    password: options.password,
    firstName: options.firstName,
    lastName: options.lastName,
  };

  // Prompt for missing information
  if (!adminData.email) {
    console.log('📧 Admin Email');
    adminData.email = await promptUser('Enter email: ');
  }

  if (!validateEmail(adminData.email)) {
    console.error('\n❌ Invalid email format. Please try again.\n');
    process.exit(1);
  }

  if (!adminData.firstName) {
    console.log('\n👤 Admin First Name');
    adminData.firstName = await promptUser('Enter first name: ');
  }

  if (!adminData.lastName) {
    console.log('\n👤 Admin Last Name');
    adminData.lastName = await promptUser('Enter last name: ');
  }

  if (!adminData.password) {
    console.log('\n🔑 Admin Password (minimum 8 characters)');
    adminData.password = await promptUser('Enter password: ');
  }

  if (adminData.password.length < 8) {
    console.error('\n❌ Password must be at least 8 characters long.\n');
    process.exit(1);
  }

  // Confirm details
  console.log('\n📋 Please confirm the admin details:\n');
  console.log(`Email:     ${adminData.email}`);
  console.log(`Name:      ${adminData.firstName} ${adminData.lastName}`);
  console.log(`Password:  ${'*'.repeat(adminData.password.length)}\n`);

  const confirm = await promptUser('Is this correct? (yes/no): ');
  
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('\n❌ Cancelled.\n');
    process.exit(0);
  }

  rl.close();

  await createAdmin(adminData);
};

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
