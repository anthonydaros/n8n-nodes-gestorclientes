# Documentação da API de Agenda - AnthonyMax.com

## Visão Geral

A API de Agenda é uma REST API que permite gerenciar clientes, agendamentos e autenticação de usuários. A API utiliza autenticação baseada em sessão/cookies.

**Base URL:** `https://agenda.anthonymax.com/api`

## Autenticação

A API utiliza autenticação baseada em sessão. Após o login bem-sucedido, um cookie de sessão é definido e deve ser incluído em todas as requisições subsequentes.

### Login

**Endpoint:** `POST /login`

**Descrição:** Autentica um usuário e inicia uma sessão.

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "email": "teste@teste.com",
  "password": "teste123"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": "69270f63-569f-4560-92e7-1fdebc61cfff",
  "email": "teste@teste.com",
  "firstName": "Teste",
  "lastName": "Teste",
  "role": "admin"
}
```

### Logout

**Endpoint:** `POST /logout`

**Descrição:** Finaliza a sessão do usuário.

**Headers:**
```
Accept: application/json
Cookie: [session-cookie]
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

## Endpoints de Clientes

### Listar Clientes

**Endpoint:** `GET /clients`

**Descrição:** Retorna uma lista de todos os clientes do usuário autenticado.

**Headers:**
```
Accept: application/json
Cookie: [session-cookie]
```

**Resposta de Sucesso (200):**
```json
[
  {
    "id": 20,
    "userId": "69270f63-569f-4560-92e7-1fdebc61cfff",
    "name": "Cliente Teste",
    "email": "cliente@teste.com",
    "phone": "11999999999",
    "cpf": null,
    "birthDate": null,
    "cep": null,
    "street": null,
    "number": null,
    "complement": null,
    "neighborhood": null,
    "city": null,
    "state": null,
    "address": null,
    "notes": null,
    "status": "active",
    "paymentStatus": "a_pagar",
    "createdAt": "2025-06-24T20:36:45.969Z",
    "updatedAt": "2025-06-24T20:36:45.969Z"
  }
]
```

### Buscar Cliente por ID

**Endpoint:** `GET /clients/{id}`

**Descrição:** Retorna os dados de um cliente específico.

**Parâmetros:**
- `id` (integer): ID do cliente

**Headers:**
```
Accept: application/json
Cookie: [session-cookie]
```

**Resposta de Sucesso (200):**
```json
{
  "id": 20,
  "userId": "69270f63-569f-4560-92e7-1fdebc61cfff",
  "name": "Cliente Teste",
  "email": "cliente@teste.com",
  "phone": "11999999999",
  "cpf": null,
  "birthDate": null,
  "cep": null,
  "street": null,
  "number": null,
  "complement": null,
  "neighborhood": null,
  "city": null,
  "state": null,
  "address": null,
  "notes": null,
  "status": "active",
  "paymentStatus": "a_pagar",
  "createdAt": "2025-06-24T20:36:45.969Z",
  "updatedAt": "2025-06-24T20:36:45.969Z"
}
```

### Criar Cliente

**Endpoint:** `POST /clients`

**Descrição:** Cria um novo cliente.

**Headers:**
```
Content-Type: application/json
Accept: application/json
Cookie: [session-cookie]
```

**Body (campos obrigatórios):**
```json
{
  "name": "Cliente Teste",
  "email": "cliente@teste.com",
  "phone": "11999999999"
}
```

**Body (todos os campos disponíveis):**
```json
{
  "name": "Cliente Teste",
  "email": "cliente@teste.com",
  "phone": "11999999999",
  "cpf": "12345678901",
  "birthDate": "1990-01-01",
  "cep": "01234567",
  "street": "Rua Teste",
  "number": "123",
  "complement": "Apto 1",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "address": "Endereço completo",
  "notes": "Observações sobre o cliente",
  "status": "active",
  "paymentStatus": "a_pagar"
}
```

**Resposta de Sucesso (201):**
```json
{
  "id": 20,
  "userId": "69270f63-569f-4560-92e7-1fdebc61cfff",
  "name": "Cliente Teste",
  "email": "cliente@teste.com",
  "phone": "11999999999",
  "cpf": null,
  "birthDate": null,
  "cep": null,
  "street": null,
  "number": null,
  "complement": null,
  "neighborhood": null,
  "city": null,
  "state": null,
  "address": null,
  "notes": null,
  "status": "active",
  "paymentStatus": "a_pagar",
  "createdAt": "2025-06-24T20:36:45.969Z",
  "updatedAt": "2025-06-24T20:36:45.969Z"
}
```

### Atualizar Cliente

**Endpoint:** `PUT /clients/{id}`

**Descrição:** Atualiza os dados de um cliente existente.

**Parâmetros:**
- `id` (integer): ID do cliente

**Headers:**
```
Content-Type: application/json
Accept: application/json
Cookie: [session-cookie]
```

**Body:**
```json
{
  "name": "Cliente Teste Atualizado",
  "email": "cliente@teste.com",
  "phone": "11999999999",
  "cpf": "12345678901"
}
```

**Resposta de Sucesso (200):**
```json
{
  "id": 20,
  "userId": "69270f63-569f-4560-92e7-1fdebc61cfff",
  "name": "Cliente Teste Atualizado",
  "email": "cliente@teste.com",
  "phone": "11999999999",
  "cpf": "12345678901",
  "birthDate": null,
  "cep": null,
  "street": null,
  "number": null,
  "complement": null,
  "neighborhood": null,
  "city": null,
  "state": null,
  "address": null,
  "notes": null,
  "status": "active",
  "paymentStatus": "a_pagar",
  "createdAt": "2025-06-24T20:36:45.969Z",
  "updatedAt": "2025-06-24T20:38:37.621Z"
}
```

### Excluir Cliente

**Endpoint:** `DELETE /clients/{id}`

**Descrição:** Remove um cliente do sistema.

**Parâmetros:**
- `id` (integer): ID do cliente

**Headers:**
```
Accept: application/json
Cookie: [session-cookie]
```

**Resposta de Sucesso (200):**
```
Sem conteúdo no body (status 200)
```

## Endpoints de Agendamentos

### Listar Agendamentos

**Endpoint:** `GET /appointments`

**Descrição:** Retorna uma lista de todos os agendamentos do usuário autenticado.

**Headers:**
```
Accept: application/json
Cookie: [session-cookie]
```

**Resposta de Sucesso (200):**
```json
[]
```

**Nota:** Durante os testes, o endpoint retornou um array vazio. A estrutura exata dos agendamentos ainda precisa ser determinada através de testes adicionais.

### Criar Agendamento

**Endpoint:** `POST /appointments`

**Descrição:** Cria um novo agendamento.

**Headers:**
```
Content-Type: application/json
Accept: application/json
Cookie: [session-cookie]
```

**Validação de Dados:**
A API utiliza validação rigorosa e requer os seguintes campos:
- `startTime`: deve ser um objeto Date válido
- `endTime`: deve ser um objeto Date válido

**Erro de Validação (400):**
```json
{
  "message": "Invalid data",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "date",
      "received": "string",
      "path": ["startTime"],
      "message": "Expected date, received string"
    },
    {
      "code": "invalid_type",
      "expected": "date",
      "received": "string",
      "path": ["endTime"],
      "message": "Expected date, received string"
    }
  ]
}
```

**Nota:** O formato correto para as datas ainda precisa ser determinado através de testes adicionais.

## Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos ou erro de validação
- **401**: Não autorizado (login necessário)
- **404**: Recurso não encontrado

## Erro de Acesso Negado

Quando uma requisição é feita sem autenticação adequada:

**Resposta (401):**
```json
{
  "message": "Acesso negado. Login necessário."
}
```

## Estrutura de Dados

### Cliente (Client)
```typescript
interface Client {
  id: number;
  userId: string;
  name: string;
  email: string;
  phone: string;
  cpf: string | null;
  birthDate: string | null;
  cep: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  notes: string | null;
  status: "active" | "inactive";
  paymentStatus: "a_pagar" | "pago" | "cancelado";
  createdAt: string;
  updatedAt: string;
}
```

### Usuário (User)
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user";
}
```

## Notas para Desenvolvimento

1. **Autenticação**: A API utiliza cookies de sessão. Certifique-se de incluir o cookie em todas as requisições após o login.

2. **Validação**: A API possui validação rigorosa de dados. Sempre verifique os tipos de dados esperados.

3. **Formato de Datas**: Para agendamentos, a API espera objetos Date JavaScript, não strings ISO. Isso requer tratamento especial ao enviar dados via JSON.

4. **Status de Cliente**: Os valores válidos para `status` são "active" e "inactive".

5. **Status de Pagamento**: Os valores válidos para `paymentStatus` são "a_pagar", "pago" e "cancelado".

6. **IDs**: Clientes utilizam IDs numéricos incrementais, enquanto usuários utilizam UUIDs.

---

*Documentação gerada através de testes de API realizados em 24/06/2025* 