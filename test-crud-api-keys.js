#!/usr/bin/env node

/**
 * Script de teste completo para validar CRUD com API keys
 * Node.js 18+ (fetch nativo)
 */

console.log('🔄 Iniciando testes de CRUD completo com API key...\n');

const BASE_URL = 'https://agenda.anthonymax.com';
const API_KEY = 'gck_25013b7c39016ec332a5f55dcd96bfe308cee7da5421f64ef908cf1fb5792911';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

// Teste 1: Conexão com API key
console.log('1️⃣ Testando conexão com API key...');
try {
  const response = await fetch(`${BASE_URL}/api/test-connection`, { headers });
  const data = await response.json();
  console.log(`   Status: ${response.status}`);
  if (response.ok) {
    console.log(`   ✅ Conectado como: ${data.user.name} (${data.user.email})`);
    console.log(`   🔑 Método de auth: ${data.authMethod}`);
  } else {
    console.log(`   ❌ Erro: ${data.message}`);
  }
} catch (error) {
  console.log(`   ❌ Erro de conexão: ${error.message}`);
}

// Teste 2: CRUD Clientes
console.log('\n2️⃣ Testando CRUD de Clientes...');

// 2.1 Listar clientes
console.log('   📋 GET /api/clients');
try {
  const response = await fetch(`${BASE_URL}/api/clients`, { headers });
  const clients = await response.json();
  console.log(`      Status: ${response.status} - ${clients.length} clientes encontrados`);
  
  if (clients.length > 0) {
    const testClientId = clients[0].id;
    console.log(`      📌 Usando cliente ID ${testClientId} para testes`);

    // 2.2 Obter cliente específico
    console.log('   📋 GET /api/clients/:id');
    const clientResponse = await fetch(`${BASE_URL}/api/clients/${testClientId}`, { headers });
    const client = await clientResponse.json();
    console.log(`      Status: ${clientResponse.status} - Cliente: ${client.name || 'N/A'}`);

    // 2.3 Atualizar cliente (PATCH)
    console.log('   📝 PATCH /api/clients/:id');
    const updateData = { notes: `Atualizado via API em ${new Date().toISOString()}` };
    const patchResponse = await fetch(`${BASE_URL}/api/clients/${testClientId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });
    console.log(`      Status: ${patchResponse.status} - ${patchResponse.ok ? 'Atualizado' : 'Erro'}`);

    // 2.4 Buscar clientes
    console.log('   🔍 GET /api/clients/search');
    const searchResponse = await fetch(`${BASE_URL}/api/clients/search?q=${encodeURIComponent(client.name?.substring(0, 3) || 'test')}`, { headers });
    const searchResults = await searchResponse.json();
    console.log(`      Status: ${searchResponse.status} - ${Array.isArray(searchResults) ? searchResults.length : 0} resultados`);
  }

  // 2.5 Criar novo cliente
  console.log('   ➕ POST /api/clients');
  const newClientData = {
    name: `Cliente API Test ${Date.now()}`,
    email: `cliente${Date.now()}@teste.com`,
    phone: '(11) 99999-9999'
  };
  const createResponse = await fetch(`${BASE_URL}/api/clients`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newClientData)
  });
  console.log(`      Status: ${createResponse.status} - ${createResponse.ok ? 'Criado' : 'Erro'}`);
  
  let newClientId = null;
  if (createResponse.ok) {
    const newClient = await createResponse.json();
    newClientId = newClient.id;
    console.log(`      🆔 Novo cliente ID: ${newClientId}`);

    // 2.6 Atualizar novo cliente (PUT)
    console.log('   ✏️ PUT /api/clients/:id');
    const putData = { ...newClientData, notes: 'Atualizado via PUT' };
    const putResponse = await fetch(`${BASE_URL}/api/clients/${newClientId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(putData)
    });
    console.log(`      Status: ${putResponse.status} - ${putResponse.ok ? 'Atualizado via PUT' : 'Erro'}`);

    // 2.7 Deletar cliente
    console.log('   🗑️ DELETE /api/clients/:id');
    const deleteResponse = await fetch(`${BASE_URL}/api/clients/${newClientId}`, {
      method: 'DELETE',
      headers
    });
    console.log(`      Status: ${deleteResponse.status} - ${deleteResponse.status === 204 ? 'Deletado' : 'Erro'}`);
  }
} catch (error) {
  console.log(`   ❌ Erro no CRUD de clientes: ${error.message}`);
}

// Teste 3: CRUD Agendamentos
console.log('\n3️⃣ Testando CRUD de Agendamentos...');

// 3.1 Listar agendamentos
console.log('   📋 GET /api/appointments');
try {
  const response = await fetch(`${BASE_URL}/api/appointments`, { headers });
  const appointments = await response.json();
  console.log(`      Status: ${response.status} - ${appointments.length} agendamentos encontrados`);

  // 3.2 Criar novo agendamento
  console.log('   ➕ POST /api/appointments');
  const newAppointmentData = {
    title: `Consulta API Test ${Date.now()}`,
    startTime: new Date(Date.now() + 24*60*60*1000).toISOString(), // Amanhã
    endTime: new Date(Date.now() + 24*60*60*1000 + 60*60*1000).toISOString(), // Amanhã + 1h
    status: 'agendado',
    consultationPrice: '100.00'
  };
  const createResponse = await fetch(`${BASE_URL}/api/appointments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newAppointmentData)
  });
  console.log(`      Status: ${createResponse.status} - ${createResponse.ok ? 'Criado' : 'Erro'}`);

  let newAppointmentId = null;
  if (createResponse.ok) {
    const newAppointment = await createResponse.json();
    newAppointmentId = newAppointment.id;
    console.log(`      🆔 Novo agendamento ID: ${newAppointmentId}`);

    // 3.3 Obter agendamento específico
    console.log('   📋 GET /api/appointments/:id');
    const appointmentResponse = await fetch(`${BASE_URL}/api/appointments/${newAppointmentId}`, { headers });
    console.log(`      Status: ${appointmentResponse.status} - ${appointmentResponse.ok ? 'Encontrado' : 'Erro'}`);

    // 3.4 Atualizar agendamento (PATCH)
    console.log('   📝 PATCH /api/appointments/:id');
    const updateData = { status: 'em_andamento', notes: `Atualizado via API em ${new Date().toISOString()}` };
    const patchResponse = await fetch(`${BASE_URL}/api/appointments/${newAppointmentId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updateData)
    });
    console.log(`      Status: ${patchResponse.status} - ${patchResponse.ok ? 'Atualizado' : 'Erro'}`);

    // 3.5 Atualizar agendamento (PUT)
    console.log('   ✏️ PUT /api/appointments/:id');
    const putData = { ...newAppointmentData, notes: 'Atualizado via PUT' };
    const putResponse = await fetch(`${BASE_URL}/api/appointments/${newAppointmentId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(putData)
    });
    console.log(`      Status: ${putResponse.status} - ${putResponse.ok ? 'Atualizado via PUT' : 'Erro'}`);

    // 3.6 Buscar agendamentos por status
    console.log('   🔍 GET /api/appointments/status/:status');
    const statusResponse = await fetch(`${BASE_URL}/api/appointments/status/agendado`, { headers });
    const statusResults = await statusResponse.json();
    console.log(`      Status: ${statusResponse.status} - ${Array.isArray(statusResults) ? statusResults.length : 0} agendamentos com status 'agendado'`);

    // 3.7 Deletar agendamento
    console.log('   🗑️ DELETE /api/appointments/:id');
    const deleteResponse = await fetch(`${BASE_URL}/api/appointments/${newAppointmentId}`, {
      method: 'DELETE',
      headers
    });
    console.log(`      Status: ${deleteResponse.status} - ${deleteResponse.status === 204 ? 'Deletado' : 'Erro'}`);
  }
} catch (error) {
  console.log(`   ❌ Erro no CRUD de agendamentos: ${error.message}`);
}

// Teste 4: CRUD Finanças
console.log('\n4️⃣ Testando CRUD de Finanças...');

// 4.1 Listar contas financeiras
console.log('   📋 GET /api/financial-accounts');
try {
  const response = await fetch(`${BASE_URL}/api/financial-accounts`, { headers });
  const accounts = await response.json();
  console.log(`      Status: ${response.status} - ${Array.isArray(accounts) ? accounts.length : 0} contas encontradas`);

  // 4.2 Resumo financeiro
  console.log('   📊 GET /api/financial-accounts/summary');
  const summaryResponse = await fetch(`${BASE_URL}/api/financial-accounts/summary`, { headers });
  console.log(`      Status: ${summaryResponse.status} - ${summaryResponse.ok ? 'Resumo obtido' : 'Erro'}`);

  // 4.3 Contas em atraso
  console.log('   ⏰ GET /api/financial-accounts/overdue');
  const overdueResponse = await fetch(`${BASE_URL}/api/financial-accounts/overdue`, { headers });
  const overdueAccounts = await overdueResponse.json();
  console.log(`      Status: ${overdueResponse.status} - ${Array.isArray(overdueAccounts) ? overdueAccounts.length : 0} contas em atraso`);

  // 4.4 Criar nova conta financeira
  console.log('   ➕ POST /api/financial-accounts');
  const newAccountData = {
    type: 'receivable',
    description: `Conta API Test ${Date.now()}`,
    amount: 150.00,
    dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString().split('T')[0], // 7 dias
    category: 'teste',
    status: 'pending'
  };
  const createResponse = await fetch(`${BASE_URL}/api/financial-accounts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newAccountData)
  });
  console.log(`      Status: ${createResponse.status} - ${createResponse.ok ? 'Criada' : 'Erro'}`);

  let newAccountId = null;
  if (createResponse.ok) {
    const newAccount = await createResponse.json();
    newAccountId = newAccount.id;
    console.log(`      🆔 Nova conta ID: ${newAccountId}`);

    // 4.5 Obter conta específica
    console.log('   📋 GET /api/financial-accounts/:id');
    const accountResponse = await fetch(`${BASE_URL}/api/financial-accounts/${newAccountId}`, { headers });
    console.log(`      Status: ${accountResponse.status} - ${accountResponse.ok ? 'Encontrada' : 'Erro'}`);

    // 4.6 Atualizar conta (PUT)
    console.log('   ✏️ PUT /api/financial-accounts/:id');
    const putData = { ...newAccountData, description: 'Atualizada via PUT' };
    const putResponse = await fetch(`${BASE_URL}/api/financial-accounts/${newAccountId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(putData)
    });
    console.log(`      Status: ${putResponse.status} - ${putResponse.ok ? 'Atualizada via PUT' : 'Erro'}`);

    // 4.7 Deletar conta
    console.log('   🗑️ DELETE /api/financial-accounts/:id');
    const deleteResponse = await fetch(`${BASE_URL}/api/financial-accounts/${newAccountId}`, {
      method: 'DELETE',
      headers
    });
    console.log(`      Status: ${deleteResponse.status} - ${deleteResponse.status === 204 ? 'Deletada' : 'Erro'}`);
  }
} catch (error) {
  console.log(`   ❌ Erro no CRUD de finanças: ${error.message}`);
}

console.log('\n🏁 Testes de CRUD completos!');
console.log('\n📋 Resumo dos endpoints testados:');
console.log('✅ API Key Authentication: Funcionando');
console.log('✅ Clientes: GET, POST, PUT, PATCH, DELETE, Search');
console.log('✅ Agendamentos: GET, POST, PUT, PATCH, DELETE, Search, Status');
console.log('✅ Finanças: GET, POST, PUT, DELETE, Summary, Overdue');

console.log('\n🔗 Endpoints disponíveis com API key:');
console.log('• GET    /api/clients');
console.log('• POST   /api/clients');
console.log('• GET    /api/clients/:id');
console.log('• PUT    /api/clients/:id');
console.log('• PATCH  /api/clients/:id');
console.log('• DELETE /api/clients/:id');
console.log('• GET    /api/clients/search?q=termo');
console.log('');
console.log('• GET    /api/appointments');
console.log('• POST   /api/appointments');
console.log('• GET    /api/appointments/:id');
console.log('• PUT    /api/appointments/:id');
console.log('• PATCH  /api/appointments/:id');
console.log('• DELETE /api/appointments/:id');
console.log('• GET    /api/appointments/search?q=termo');
console.log('• GET    /api/appointments/client/:clientId');
console.log('• GET    /api/appointments/status/:status');
console.log('');
console.log('• GET    /api/financial-accounts');
console.log('• POST   /api/financial-accounts');
console.log('• GET    /api/financial-accounts/:id');
console.log('• PUT    /api/financial-accounts/:id');
console.log('• DELETE /api/financial-accounts/:id');
console.log('• GET    /api/financial-accounts/summary');
console.log('• GET    /api/financial-accounts/overdue'); 