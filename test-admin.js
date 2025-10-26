// Test the admin endpoint with authentication
import fetch from 'node-fetch';

async function testAdmin() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Admin Authentication and Data...\n');
  
  try {
    // Test 1: Login to get token
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${baseUrl}/api/trpc/auth.login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "0": {
          "json": {
            "username": "admin",
            "password": "9s71Q8VO+1-1"
          }
        }
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login response:', loginData);
    
    if (loginData[0]?.result?.data?.success) {
      const token = loginData[0].result.data.token;
      console.log('✅ Login successful! Token received.');
      
      // Test 2: Access admin data with token
      console.log('\n2. Testing admin data access...');
      const adminResponse = await fetch(`${baseUrl}/api/trpc/giveaway.getAllEntries?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const adminData = await adminResponse.json();
      console.log('✅ Admin data response:', JSON.stringify(adminData, null, 2));
      
      if (adminData[0]?.result?.data) {
        console.log(`\n🎉 SUCCESS! Found ${adminData[0].result.data.length} giveaway entries`);
        console.log('Sample entries:');
        adminData[0].result.data.slice(0, 2).forEach((entry, i) => {
          console.log(`  ${i + 1}. ${entry.firstName} ${entry.lastName} (${entry.email}) - ${entry.nflTeam}`);
        });
      } else {
        console.log('❌ No data received');
      }
      
    } else {
      console.log('❌ Login failed!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdmin();
