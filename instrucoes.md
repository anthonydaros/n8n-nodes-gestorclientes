Manual Completo: Como Criar Nodes n8n para APIs CRUD com Suporte a Tools

  Este manual ensina como criar nodes n8n completos para gerenciar APIs CRUD de qualquer site, incluindo suporte
  a tools para LLMs.

  📋 Índice

  1. #preparação-do-ambiente
  2. #estrutura-do-projeto
  3. #configuração-inicial
  4. #criando-credenciais
  5. #criando-node-principal
  6. #criando-subnodes
  7. #configurando-tools-para-llms
  8. #build-e-publicação
  9. #testes
  10. #boas-práticas

  ---
  1. Preparação do Ambiente

  Requisitos

  - Node.js >= 18.0.0
  - npm ou yarn
  - TypeScript
  - Conhecimento básico da API que será integrada

  Ferramentas Necessárias

  npm install -g n8n
  npm install -g typescript

  ---
  2. Estrutura do Projeto

  Estrutura Recomendada

  meu-node-api/
  ├── package.json
  ├── tsconfig.json
  ├── .eslintrc.js
  ├── index.ts
  ├── credentials/
  │   └── MinhaApiCredentials.credentials.ts
  ├── nodes/
  │   └── MinhaApi/
  │       ├── MinhaApi.node.ts (node principal)
  │       ├── MinhaApiRecurso1.node.ts (subnode)
  │       ├── MinhaApiRecurso2.node.ts (subnode)
  │       └── icon.svg
  └── dist/ (gerado pelo build)

  ---
  3. Configuração Inicial

  3.1 package.json

  {
    "name": "@seuusuario/n8n-nodes-minhaapi",
    "version": "1.0.0",
    "description": "N8n community nodes para integração com Minha API",
    "main": "index.js",
    "scripts": {
      "build": "tsc && cp nodes/**/*.svg dist/nodes/",
      "dev": "tsc --watch",
      "lint": "eslint nodes/**/*.ts credentials/**/*.ts package.json",
      "lint:fix": "eslint nodes/**/*.ts credentials/**/*.ts package.json --fix",
      "prepublishOnly": "npm run build && npm run lint"
    },
    "keywords": [
      "n8n-community-node-package",
      "n8n",
      "n8n-nodes",
      "api-integration"
    ],
    "author": "Seu Nome",
    "license": "MIT",
    "engines": {
      "node": ">=18.0.0"
    },
    "peerDependencies": {
      "n8n-workflow": "*"
    },
    "files": [
      "dist"
    ],
    "n8n": {
      "n8nNodesApiVersion": 1,
      "nodes": [
        "dist/nodes/MinhaApi/MinhaApi.node.js",
        "dist/nodes/MinhaApi/MinhaApiRecurso1.node.js",
        "dist/nodes/MinhaApi/MinhaApiRecurso2.node.js"
      ],
      "credentials": [
        "dist/credentials/MinhaApiCredentials.credentials.js"
      ]
    },
    "devDependencies": {
      "@typescript-eslint/parser": "~8.32.0",
      "eslint": "^8.57.1",
      "prettier": "^3.6.0",
      "typescript": "^5.8.3"
    },
    "type": "commonjs"
  }

  3.2 tsconfig.json

  {
    "compilerOptions": {
      "target": "ES2019",
      "module": "commonjs",
      "lib": ["es2019"],
      "outDir": "dist",
      "rootDir": ".",
      "strict": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "forceConsistentCasingInFileNames": true,
      "declaration": true,
      "sourceMap": true,
      "experimentalDecorators": true,
      "emitDecoratorMetadata": true,
      "moduleResolution": "node",
      "resolveJsonModule": true
    },
    "include": ["nodes/**/*", "credentials/**/*", "index.ts"],
    "exclude": ["node_modules", "dist"]
  }

  3.3 .eslintrc.js

  module.exports = {
    parser: '@typescript-eslint/parser',
    env: {
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
    },
  };

  ---
  4. Criando Credenciais

  4.1 Estrutura Base das Credenciais

  // credentials/MinhaApiCredentials.credentials.ts
  import type {
    ICredentialType,
    INodeProperties,
  } from 'n8n-workflow';

  export class MinhaApiCredentials implements ICredentialType {
    name = 'minhaApiCredentials';
    displayName = 'Minha API';
    documentationUrl = 'https://docs.minhaapi.com/';
    properties: INodeProperties[] = [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'Chave de API para autenticação',
      },
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://api.minhaapi.com/v1',
        required: true,
        description: 'URL base da API',
      },
    ];
  }

  4.2 Tipos de Autenticação Comuns

  API Key no Header:
  {
    displayName: 'API Key',
    name: 'apiKey',
    type: 'string',
    typeOptions: { password: true },
    default: '',
    required: true,
  }

  Bearer Token:
  {
    displayName: 'Bearer Token',
    name: 'bearerToken',
    type: 'string',
    typeOptions: { password: true },
    default: '',
    required: true,
  }

  Basic Auth:
  {
    displayName: 'Username',
    name: 'username',
    type: 'string',
    default: '',
    required: true,
  },
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: { password: true },
    default: '',
    required: true,
  }

  ---
  5. Criando Node Principal

  5.1 Template Base do Node Principal

  // nodes/MinhaApi/MinhaApi.node.ts
  import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
  } from 'n8n-workflow';
  import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

  export class MinhaApi implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'Minha API',
      name: 'minhaApi',
      icon: 'file:icon.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter.resource + ": " + $parameter.operation}}',
      description: 'Integração completa com Minha API para operações CRUD',
      defaults: {
        name: 'Minha API',
      },
      inputs: [
        {
          displayName: '',
          type: NodeConnectionType.Main,
        },
      ],
      outputs: [
        {
          displayName: '',
          type: NodeConnectionType.Main,
        },
      ],
      credentials: [
        {
          name: 'minhaApiCredentials',
          required: true,
        },
      ],
      properties: [
        // Resource selector
        {
          displayName: 'Resource',
          name: 'resource',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'Usuários',
              value: 'users',
            },
            {
              name: 'Produtos',
              value: 'products',
            },
            // Adicione mais recursos conforme necessário
          ],
          default: 'users',
        },

        // Operations para cada resource
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          displayOptions: {
            show: {
              resource: ['users'],
            },
          },
          options: [
            {
              name: 'Create',
              value: 'create',
              description: 'Criar novo usuário',
              action: 'Criar usuário',
            },
            {
              name: 'Get All',
              value: 'getAll',
              description: 'Buscar todos os usuários',
              action: 'Buscar todos os usuários',
            },
            {
              name: 'Get By ID',
              value: 'get',
              description: 'Buscar usuário por ID',
              action: 'Buscar usuário por ID',
            },
            {
              name: 'Update',
              value: 'update',
              description: 'Atualizar usuário',
              action: 'Atualizar usuário',
            },
            {
              name: 'Delete',
              value: 'delete',
              description: 'Deletar usuário',
              action: 'Deletar usuário',
            },
          ],
          default: 'getAll',
        },

        // Campos específicos para cada operação
        // ... (ver seção de campos)
      ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const items = this.getInputData();
      const returnData = [];
      const credentials = await this.getCredentials('minhaApiCredentials');

      for (let i = 0; i < items.length; i++) {
        try {
          const resource = this.getNodeParameter('resource', i);
          const operation = this.getNodeParameter('operation', i);

          let responseData;

          if (resource === 'users') {
            responseData = await handleUserOperations.call(this, operation, i, credentials);
          } else if (resource === 'products') {
            responseData = await handleProductOperations.call(this, operation, i, credentials);
          }

          if (!responseData) {
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${resource}.${operation}`);
          }

          returnData.push({
            json: responseData,
            pairedItem: {
              item: i,
            },
          });
        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: error instanceof Error ? error.message : String(error),
              },
              pairedItem: {
                item: i,
              },
            });
            continue;
          }
          throw error;
        }
      }

      return [returnData];
    }
  }

  // Funções de manipulação para cada resource
  async function handleUserOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials:
   any) {
    const baseUrl = credentials.baseUrl;
    const apiKey = credentials.apiKey;

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    switch (operation) {
      case 'getAll': {
        return await this.helpers.httpRequest({
          method: 'GET',
          url: `${baseUrl}/users`,
          headers,
          json: true,
        });
      }

      case 'get': {
        const userId = this.getNodeParameter('userId', itemIndex);
        return await this.helpers.httpRequest({
          method: 'GET',
          url: `${baseUrl}/users/${userId}`,
          headers,
          json: true,
        });
      }

      case 'create': {
        const userData: any = {
          name: this.getNodeParameter('name', itemIndex),
          email: this.getNodeParameter('email', itemIndex),
        };

        return await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}/users`,
          headers,
          body: userData,
          json: true,
        });
      }

      case 'update': {
        const userId = this.getNodeParameter('userId', itemIndex);
        const userData: any = {
          name: this.getNodeParameter('name', itemIndex),
          email: this.getNodeParameter('email', itemIndex),
        };

        return await this.helpers.httpRequest({
          method: 'PUT',
          url: `${baseUrl}/users/${userId}`,
          headers,
          body: userData,
          json: true,
        });
      }

      case 'delete': {
        const userId = this.getNodeParameter('userId', itemIndex);
        return await this.helpers.httpRequest({
          method: 'DELETE',
          url: `${baseUrl}/users/${userId}`,
          headers,
          json: true,
        });
      }

      default:
        throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
    }
  }

  ---
  6. Criando Subnodes

  6.1 Template para Subnode

  // nodes/MinhaApi/MinhaApiUsuarios.node.ts
  import type {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
  } from 'n8n-workflow';
  import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

  export class MinhaApiUsuarios implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'Minha API - Usuários',
      name: 'minhaApiUsuarios',
      icon: 'file:icon.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter.operation}}',
      description: 'Gerenciar usuários: criar, buscar, atualizar e deletar usuários via API. Use para operações 
  relacionadas a cadastro de usuários.',
      defaults: {
        name: 'Minha API - Usuários',
      },
      inputs: [
        {
          displayName: '',
          type: NodeConnectionType.Main,
        },
      ],
      outputs: [
        {
          displayName: '',
          type: NodeConnectionType.Main,
        },
      ],
      usableAsTool: true, // IMPORTANTE: Para funcionar como tool
      credentials: [
        {
          name: 'minhaApiCredentials',
          required: true,
        },
      ],
      properties: [
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          options: [
            {
              name: 'Create',
              value: 'create',
              description: 'Criar novo usuário',
              action: 'Criar usuário',
            },
            {
              name: 'Get All',
              value: 'getAll',
              description: 'Buscar todos os usuários',
              action: 'Buscar todos os usuários',
            },
            {
              name: 'Get By ID',
              value: 'get',
              description: 'Buscar usuário por ID',
              action: 'Buscar usuário por ID',
            },
            {
              name: 'Update',
              value: 'update',
              description: 'Atualizar usuário',
              action: 'Atualizar usuário',
            },
            {
              name: 'Delete',
              value: 'delete',
              description: 'Deletar usuário',
              action: 'Deletar usuário',
            },
          ],
          default: 'getAll',
        },

        // ID field para operações específicas
        {
          displayName: 'User ID',
          name: 'userId',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['get', 'update', 'delete'],
            },
          },
          default: '',
          required: true,
          description: 'ID do usuário',
        },

        // Campos para create/update
        {
          displayName: 'Nome',
          name: 'name',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['create', 'update'],
            },
          },
          default: '',
          required: true,
          description: 'Nome do usuário',
        },
        {
          displayName: 'Email',
          name: 'email',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['create', 'update'],
            },
          },
          default: '',
          required: true,
          description: 'Email do usuário',
        },
      ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const items = this.getInputData();
      const returnData = [];
      const credentials = await this.getCredentials('minhaApiCredentials');

      for (let i = 0; i < items.length; i++) {
        try {
          const operation = this.getNodeParameter('operation', i);
          let responseData;

          responseData = await handleUserOperations.call(this, operation, i, credentials);

          if (!responseData) {
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
          }

          returnData.push({
            json: responseData,
            pairedItem: {
              item: i,
            },
          });
        } catch (error) {
          if (this.continueOnFail()) {
            returnData.push({
              json: {
                error: error instanceof Error ? error.message : String(error),
              },
              pairedItem: {
                item: i,
              },
            });
            continue;
          }
          throw error;
        }
      }

      return [returnData];
    }
  }

  // Reutilizar a mesma função handleUserOperations do node principal
  async function handleUserOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials:
   any) {
    // ... (código idêntico ao node principal)
  }

  ---
  7. Configurando Tools para LLMs

  7.1 Requisitos para Tools

  Para que um node funcione como tool para LLMs, ele deve ter:

  export class MeuSubnode implements INodeType {
    description: INodeTypeDescription = {
      // ... outras propriedades
      usableAsTool: true, // OBRIGATÓRIO
      description: 'Descrição clara do que o tool faz para o LLM entender', // IMPORTANTE
      // ...
    };
  }

  7.2 Boas Descrições para LLMs

  // ✅ BOM - Descrição clara e específica
  description: 'Gerenciar usuários: criar, buscar, atualizar e deletar usuários via API. Use para operações 
  relacionadas a cadastro de usuários.',

  // ❌ RUIM - Descrição vaga
  description: 'Operações CRUD para usuários',

  7.3 Nomes de Tools Adequados

  // ✅ BOM - Nome descritivo
  name: 'minhaApiUsuarios',

  // ❌ RUIM - Nome genérico
  name: 'apiNode',

  ---
  8. Build e Publicação

  8.1 index.ts

  import type { ICredentialType, INodeType } from 'n8n-workflow';

  import { MinhaApi } from './nodes/MinhaApi/MinhaApi.node';
  import { MinhaApiUsuarios } from './nodes/MinhaApi/MinhaApiUsuarios.node';
  import { MinhaApiProdutos } from './nodes/MinhaApi/MinhaApiProdutos.node';
  import { MinhaApiCredentials } from './credentials/MinhaApiCredentials.credentials';

  export const nodes: INodeType[] = [
    new MinhaApi(),           // Node principal
    new MinhaApiUsuarios(),   // Subnode usuários
    new MinhaApiProdutos(),   // Subnode produtos
  ];

  export const credentials: ICredentialType[] = [
    new MinhaApiCredentials(),
  ];

  8.2 Comandos de Build

  # Instalar dependências
  npm install

  # Build do projeto
  npm run build

  # Verificar linting
  npm run lint

  # Publicar no npm
  npm publish

  ---
  9. Testes

  9.1 Testando Localmente

  # Instalar globalmente para teste
  npm link

  # Em n8n, instalar o package local
  n8n install file:/path/to/your/package

  9.2 Script de Teste de API

  // test-api.js
  const axios = require('axios');

  const credentials = {
    apiKey: 'sua-api-key',
    baseUrl: 'https://api.minhaapi.com/v1'
  };

  async function testEndpoints() {
    const headers = {
      'Authorization': `Bearer ${credentials.apiKey}`,
      'Content-Type': 'application/json'
    };

    try {
      // Testar GET
      const getResponse = await axios.get(`${credentials.baseUrl}/users`, { headers });
      console.log('GET Users:', getResponse.data);

      // Testar POST
      const postData = { name: 'Teste', email: 'teste@example.com' };
      const postResponse = await axios.post(`${credentials.baseUrl}/users`, postData, { headers });
      console.log('POST User:', postResponse.data);

    } catch (error) {
      console.error('Erro:', error.response?.data || error.message);
    }
  }

  testEndpoints();

  ---
  10. Boas Práticas

  10.1 Estrutura de Código

  - Separar lógica por resource em funções específicas
  - Reutilizar código entre node principal e subnodes
  - Usar TypeScript para type safety
  - Validar dados antes de enviar para API

  10.2 Tratamento de Erros

  try {
    const response = await this.helpers.httpRequest({
      method: 'GET',
      url: `${baseUrl}/users`,
      headers,
      json: true,
    });
    return response;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new NodeOperationError(this.getNode(), 'Usuário não encontrado');
    }
    throw new NodeOperationError(this.getNode(), `Erro na API: ${error.message}`);
  }

  10.3 Campos Condicionais

  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    displayOptions: {
      show: {
        operation: ['get', 'update', 'delete'], // Só mostra para essas operações
      },
    },
    required: true,
  }

  10.4 Validação de Dados

  const email = this.getNodeParameter('email', itemIndex) as string;
  if (!email.includes('@')) {
    throw new NodeOperationError(this.getNode(), 'Email inválido');
  }

  10.5 Paginação

  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['getAll'],
      },
    },
    default: 50,
    description: 'Número máximo de itens a retornar',
  },
  {
    displayName: 'Page',
    name: 'page',
    type: 'number',
    displayOptions: {
      show: {
        operation: ['getAll'],
      },
    },
    default: 1,
    description: 'Página dos resultados',
  }

  ---
  📚 Recursos Adicionais

  Documentação Oficial

  - https://docs.n8n.io/integrations/creating-nodes/
  - https://docs.n8n.io/integrations/creating-nodes/code/

  Repositórios de Exemplo

  - https://github.com/n8n-io/n8n-nodes-starter
  - https://github.com/n8n-io/n8n/tree/master/packages/nodes-base/nodes

  Ferramentas Úteis

  - https://www.postman.com/ - Para testar APIs
  - https://insomnia.rest/ - Alternativa ao Postman
  - https://jsonplaceholder.typicode.com/ - API fake para testes

  ---
  ✅ Checklist Final

  Antes de publicar seu node, verifique:

  - Credenciais configuradas corretamente
  - Node principal com todos os resources
  - Subnodes com usableAsTool: true
  - Descrições claras para LLMs
  - Tratamento de erros adequado
  - Build executando sem erros
  - Linting passando
  - Testes com API real
  - package.json com configurações corretas
  - README com instruções de uso

  ---
  Este manual fornece uma base sólida para criar nodes n8n completos e funcionais para qualquer API CRUD,
  incluindo suporte avançado para tools de LLMs.