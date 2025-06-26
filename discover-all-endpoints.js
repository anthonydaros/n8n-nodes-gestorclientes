const https = require('https');

const API_KEY = 'gck_25013b7c39016ec332a5f55dcd96bfe308cee7da5421f64ef908cf1fb5792911';
const BASE_URL = 'http://localhost:5800/api';

function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 5800,
      path: url.pathname + (url.search || ''),
      method,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.headers['Content-Type'] = 'application/json';
    }

    const http = require('http'); // Use http for localhost
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody,
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function discoverEndpoints() {
  console.log('🔍 Descobrindo todos os endpoints disponíveis...\n');

  // Test health and docs endpoints first
  const systemEndpoints = [
    '/health',
    '/docs/',
    '/test-connection'
  ];

  // Test known resource endpoints
  const resourceEndpoints = [
    '/clients',
    '/appointments', 
    '/financial-accounts',
    '/finances',
    '/transactions',
    '/payments',
    '/services',
    '/users',
    '/accounts',
    '/bills',
    '/reports',
    '/dashboard',
    '/analytics',
    '/categories',
    '/settings'
  ];

  // Test endpoint variations
  const searchEndpoints = [
    '/clients/search',
    '/appointments/search',
    '/appointments/status/scheduled',
    '/appointments/client/1',
    '/financial-accounts/summary',
    '/financial-accounts/overdue'
  ];

  console.log('=== SYSTEM ENDPOINTS ===');
  for (const endpoint of systemEndpoints) {
    try {
      const response = await makeRequest(endpoint);
      console.log(`${endpoint}: Status ${response.statusCode}`);
      if (response.statusCode < 400) {
        console.log(`✅ ${endpoint} - Available`);
        if (endpoint === '/health' && typeof response.body === 'object') {
          console.log(`   Health check response:`, response.body);
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  console.log('\n=== RESOURCE ENDPOINTS ===');
  const workingEndpoints = [];
  
  for (const endpoint of resourceEndpoints) {
    try {
      const response = await makeRequest(endpoint);
      console.log(`${endpoint}: Status ${response.statusCode}`);
      
      if (response.statusCode < 400) {
        console.log(`✅ ${endpoint} - Available`);
        if (Array.isArray(response.body)) {
          console.log(`   Array with ${response.body.length} items`);
        } else if (typeof response.body === 'object') {
          console.log(`   Object response`);
        }
        workingEndpoints.push(endpoint);
      } else {
        console.log(`❌ ${endpoint} - Error ${response.statusCode}`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Request failed: ${error.message}`);
    }
  }

  console.log('\n=== SPECIALIZED ENDPOINTS ===');
  for (const endpoint of searchEndpoints) {
    try {
      const response = await makeRequest(endpoint);
      console.log(`${endpoint}: Status ${response.statusCode}`);
      
      if (response.statusCode < 400) {
        console.log(`✅ ${endpoint} - Available`);
        if (Array.isArray(response.body)) {
          console.log(`   Array with ${response.body.length} items`);
        } else if (typeof response.body === 'object') {
          console.log(`   Object response:`, Object.keys(response.body));
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Request failed: ${error.message}`);
    }
  }

  // Test CRUD operations on working endpoints
  console.log('\n=== TESTING CRUD OPERATIONS ===');
  for (const endpoint of workingEndpoints) {
    console.log(`\nTesting CRUD for ${endpoint}:`);
    
    // Test GET (already done above)
    console.log(`  GET ${endpoint}: ✅`);
    
    // Test POST (create)
    try {
      let testData = {};
      if (endpoint.includes('client')) {
        testData = { name: 'Test Client', email: 'test@test.com', phone: '123456789' };
      } else if (endpoint.includes('appointment')) {
        testData = { 
          clientId: 1, 
          title: 'Test Appointment', 
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString()
        };
      } else if (endpoint.includes('financial')) {
        testData = { 
          description: 'Test Transaction', 
          amount: 100,
          type: 'income',
          dueDate: new Date().toISOString()
        };
      }
      
      const postResponse = await makeRequest(endpoint, 'POST', testData);
      console.log(`  POST ${endpoint}: Status ${postResponse.statusCode}`);
      
      if (postResponse.statusCode === 201 && postResponse.body.id) {
        const newId = postResponse.body.id;
        console.log(`    ✅ Created with ID: ${newId}`);
        
        // Test GET by ID
        const getByIdResponse = await makeRequest(`${endpoint}/${newId}`);
        console.log(`  GET ${endpoint}/${newId}: Status ${getByIdResponse.statusCode}`);
        
        // Test PUT (update)
        const putResponse = await makeRequest(`${endpoint}/${newId}`, 'PUT', { ...testData, updated: true });
        console.log(`  PUT ${endpoint}/${newId}: Status ${putResponse.statusCode}`);
        
        // Test PATCH (partial update)
        const patchResponse = await makeRequest(`${endpoint}/${newId}`, 'PATCH', { updated: true });
        console.log(`  PATCH ${endpoint}/${newId}: Status ${patchResponse.statusCode}`);
        
        // Test DELETE
        const deleteResponse = await makeRequest(`${endpoint}/${newId}`, 'DELETE');
        console.log(`  DELETE ${endpoint}/${newId}: Status ${deleteResponse.statusCode}`);
        
      } else {
        console.log(`    ❌ POST failed: ${postResponse.statusCode}`);
        if (postResponse.body && postResponse.body.message) {
          console.log(`    Error: ${postResponse.body.message}`);
        }
      }
    } catch (error) {
      console.log(`  ❌ CRUD test failed: ${error.message}`);
    }
  }

  console.log('\n🎉 Endpoint discovery completed!');
  console.log(`\nWorking endpoints found: ${workingEndpoints.length}`);
  workingEndpoints.forEach(endpoint => console.log(`  - ${endpoint}`));
}

discoverEndpoints();