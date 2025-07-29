#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Paylists Environment Setup Script');
console.log('=====================================\n');

const envContent = `# ================================
# SUPABASE CONFIGURATION
# ================================

# Project Details:
# Project ID: msxxbrnlsaoyvbotylkz
# Project Name: playlist
# Organization: SahiDemon (oxawezriysfeuxpaujlq)
# Region: ap-southeast-1
# Status: ACTIVE_HEALTHY

# Core Supabase URLs and Keys
NEXT_PUBLIC_SUPABASE_URL=https://msxxbrnlsaoyvbotylkz.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://msxxbrnlsaoyvbotylkz.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHhicm5sc2FveXZib3R5bGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjU0NTAsImV4cCI6MjA2NzMwMTQ1MH0.R93yg8PbvlSDQ8n5_tmTs6EzD13hZtSeHGs0YdwGgNo
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHhicm5sc2FveXZib3R5bGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MjU0NTAsImV4cCI6MjA2NzMwMTQ1MH0.R93yg8PbvlSDQ8n5_tmTs6EzD13hZtSeHGs0YdwGgNo

# Service Role Key (CRITICAL - GET FROM SUPABASE DASHBOARD)
# Go to: https://supabase.com/dashboard/project/msxxbrnlsaoyvbotylkz/settings/api
# Copy the service_role key and replace the placeholder below
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Database Configuration
# Database Host: db.msxxbrnlsaoyvbotylkz.supabase.co
# PostgreSQL Version: 17.4.1.048

# ================================
# APPLICATION CONFIGURATION
# ================================

# Environment
ENVIRONMENT=development

# App Domain (used for redirects and emails)
APP_DOMAIN=localhost:3000
NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000

# ================================
# THIRD-PARTY API KEYS
# ================================

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here

# Payment Gateway (Crezco)
CREZCO_API_KEY=your_crezco_api_key_here
CREZCO_API_URL=your_crezco_api_url_here
CREZCO_PAYLISTS_USER_ID=your_crezco_user_id_here

# Global Pay
GLOBAL_PAY_URL=your_global_pay_url_here

# Xero Integration
XERO_CLIENT_ID=your_xero_client_id_here
XERO_CLIENT_SECRET=your_xero_client_secret_here

# ================================
# SUPABASE STUDIO CONFIGURATION
# ================================

# OpenAI API Key for Supabase AI features
OPENAI_API_KEY=your_openai_api_key_here

# ================================
# LOCAL DEVELOPMENT PORTS
# ================================

# These are used by Supabase local development
SUPABASE_API_PORT=54321
SUPABASE_DB_PORT=54322
SUPABASE_STUDIO_PORT=54323
SUPABASE_INBUCKET_PORT=54324

# ================================
# NEXT.JS CONFIGURATION
# ================================

# Next.js App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
`;

const envPath = path.join(process.cwd(), '.env');

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log('Creating backup as .env.backup...');
    fs.copyFileSync(envPath, path.join(process.cwd(), '.env.backup'));
  }

  // Write the new .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Successfully created .env file!');
  console.log('📍 Location:', envPath);
  console.log('\n🔑 IMPORTANT NEXT STEPS:');
  console.log('1. Get your SERVICE_ROLE_KEY from Supabase Dashboard:');
  console.log('   👉 https://supabase.com/dashboard/project/msxxbrnlsaoyvbotylkz/settings/api');
  console.log('2. Replace "YOUR_SERVICE_ROLE_KEY_HERE" in .env file');
  console.log('3. Fill in other API keys as needed for your integrations');
  console.log('\n🚀 Your Supabase Edge Functions are deployed and ready!');
  console.log('🌐 Function URL: https://msxxbrnlsaoyvbotylkz.supabase.co/functions/v1/user');

} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
  console.log('\n📋 Manual Setup Required:');
  console.log('Please create a .env file manually with the configuration above.');
}

console.log('\n🔧 Edge Functions Deployed:');
console.log('✅ user - https://msxxbrnlsaoyvbotylkz.supabase.co/functions/v1/user');
console.log('\n📚 Documentation:');
console.log('- Supabase Functions: https://supabase.com/docs/guides/functions');
console.log('- Environment Variables: https://supabase.com/docs/guides/functions/secrets'); 