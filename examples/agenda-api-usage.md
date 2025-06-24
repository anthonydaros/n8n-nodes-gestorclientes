# Exemplos de Uso - Workflow MCP Agenda API

Este arquivo contém exemplos práticos de como usar o workflow MCP da API de Agenda após importá-lo no n8n.

## Pré-requisitos

1. Importe o workflow `workflows/agenda-api-mcp-workflow.json` no seu n8n
2. Ative o workflow
3. Certifique-se de que o MCP Server está rodando e conectado

## Credenciais de Teste

Para testes, use as seguintes credenciais:
- **Email**: `teste@teste.com`
- **Password**: `teste123`

## Exemplos de Comandos

### 1. Autenticação

#### Login
```bash
# Através do MCP
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "login",
    "parameters": {
      "body": {
        "email": "teste@teste.com",
        "password": "teste123"
      }
    }
  }'
```

#### Logout
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "logout"
  }'
```

### 2. Gerenciamento de Clientes

#### Listar Todos os Clientes
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "list_clients"
  }'
```

#### Criar um Novo Cliente
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "create_client",
    "parameters": {
      "body": {
        "name": "João Silva",
        "email": "joao@example.com",
        "phone": "11987654321",
        "cpf": "12345678901",
        "birthDate": "1985-03-15",
        "cep": "01234567",
        "street": "Rua das Flores",
        "number": "123",
        "complement": "Apto 45",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "notes": "Cliente preferencial",
        "status": "active",
        "paymentStatus": "a_pagar"
      }
    }
  }'
```

#### Buscar Cliente por ID
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "get_client",
    "parameters": {
      "client_id": 1
    }
  }'
```

#### Atualizar Cliente
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "update_client",
    "parameters": {
      "client_id": 1,
      "body": {
        "name": "João Silva Santos",
        "phone": "11999888777",
        "paymentStatus": "pago"
      }
    }
  }'
```

#### Excluir Cliente
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "delete_client",
    "parameters": {
      "client_id": 1
    }
  }'
```

### 3. Gerenciamento de Agendamentos

#### Listar Agendamentos
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "list_appointments"
  }'
```

#### Criar Agendamento
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "create_appointment",
    "parameters": {
      "body": {
        "clientId": 1,
        "title": "Consulta de Rotina",
        "description": "Consulta médica de rotina anual",
        "startTime": "2025-06-25T14:00:00.000Z",
        "endTime": "2025-06-25T15:00:00.000Z",
        "status": "scheduled"
      }
    }
  }'
```

## Fluxo de Trabalho Típico

### Cenário: Criando um Cliente e Agendamento

1. **Faça Login**
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "login",
    "parameters": {
      "body": {
        "email": "teste@teste.com",
        "password": "teste123"
      }
    }
  }'
```

2. **Crie um Cliente**
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "create_client",
    "parameters": {
      "body": {
        "name": "Maria Santos",
        "email": "maria@example.com",
        "phone": "11888777666"
      }
    }
  }'
```

3. **Liste os Clientes para Obter o ID**
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "list_clients"
  }'
```

4. **Crie um Agendamento** (usando o ID do cliente retornado)
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "create_appointment",
    "parameters": {
      "body": {
        "clientId": 2,
        "title": "Primeira Consulta",
        "description": "Consulta inicial para avaliação",
        "startTime": "2025-06-26T09:00:00.000Z",
        "endTime": "2025-06-26T10:00:00.000Z",
        "status": "scheduled"
      }
    }
  }'
```

5. **Faça Logout**
```bash
curl -X POST "http://localhost:5678/webhook/agenda-api-mcp" \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "logout"
  }'
```

## Tratamento de Erros

### Erro de Autenticação
Se você receber a mensagem `"Acesso negado. Login necessário."`, certifique-se de:
1. Fazer login primeiro
2. Usar as credenciais corretas
3. Manter a sessão ativa

### Erro de Validação
Para erros do tipo `"Invalid data"`, verifique:
1. Se todos os campos obrigatórios estão presentes
2. Se os tipos de dados estão corretos
3. Se as datas estão no formato adequado

### Exemplo de Resposta de Erro
```json
{
  "message": "Invalid data",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

## Dicas de Uso

1. **Sempre faça login antes de usar outros endpoints**
2. **Guarde os IDs retornados** para usar em operações subsequentes
3. **Use `neverError: true`** no workflow para capturar erros sem quebrar a execução
4. **Teste primeiro com dados simples** antes de usar dados complexos
5. **Para agendamentos**, certifique-se de que o formato de data seja compatível com a API

## Próximos Passos

- Teste todos os endpoints para validar o funcionamento
- Implemente tratamento de erros mais robusto
- Adicione logging para debug
- Configure autenticação automática se necessário
- Expanda para outros recursos da API conforme disponíveis

---

*Exemplos criados com base na documentação da API testada em 24/06/2025* 