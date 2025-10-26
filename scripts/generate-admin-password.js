import bcrypt from 'bcryptjs';

const password = process.argv[2] || '9s71Q8VO+1-1';
const saltRounds = 10;

async function generateHash() {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('\n=== Admin Password Hash Generator ===');
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('\nTo update the admin password:');
    console.log('1. Copy the hash above');
    console.log('2. Update the ADMIN_PASSWORD_HASH in server/_core/authRoutes.ts');
    console.log('3. Restart the server\n');
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
