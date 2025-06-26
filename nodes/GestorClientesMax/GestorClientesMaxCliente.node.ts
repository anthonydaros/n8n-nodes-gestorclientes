import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class GestorClientesMaxCliente implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gestor Clientes Max - Cliente',
    name: 'gestorClientesMaxCliente',
    icon: 'file:gestorclientes.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter.operation}}',
    description: 'Gerenciar clientes: criar, buscar, atualizar e deletar clientes via API. Use para operações relacionadas a cadastro de clientes.',
    defaults: {
      name: 'Gestor Clientes Max - Cliente',
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
    usableAsTool: true,
    credentials: [
      {
        name: 'gestorClientesMaxApi',
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
            description: 'Criar um novo cliente',
            action: 'Criar cliente',
          },
          {
            name: 'Get All',
            value: 'getAll',
            description: 'Buscar todos os clientes',
            action: 'Buscar todos os clientes',
          },
          {
            name: 'Get By ID',
            value: 'get',
            description: 'Buscar cliente por ID',
            action: 'Buscar cliente por ID',
          },
          {
            name: 'Update',
            value: 'update',
            description: 'Atualizar cliente existente',
            action: 'Atualizar cliente',
          },
          {
            name: 'Delete',
            value: 'delete',
            description: 'Deletar cliente',
            action: 'Deletar cliente',
          },
        ],
        default: 'getAll',
      },

      // Client ID for get/update/delete operations
      {
        displayName: 'Client ID',
        name: 'clientId',
        type: 'number',
        displayOptions: {
          show: {
            operation: ['get', 'update', 'delete'],
          },
        },
        default: '',
        required: true,
        description: 'ID do cliente',
      },

      // Client Fields
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
        description: 'Nome do cliente',
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
        description: 'Email do cliente',
      },
      {
        displayName: 'Telefone',
        name: 'phone',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['create', 'update'],
          },
        },
        default: '',
        required: true,
        description: 'Telefone do cliente',
      },
      {
        displayName: 'CPF',
        name: 'cpf',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['create', 'update'],
          },
        },
        default: '',
        description: 'CPF do cliente',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData = [];
    const credentials = await this.getCredentials('gestorClientesMaxApi');

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i);
        let responseData;

        responseData = await handleClientOperations.call(this, operation, i, credentials);

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

async function handleClientOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials: any) {
  const baseUrl = credentials.baseUrl;
  const apiKey = credentials.apiKey;

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Accept': 'application/json',
  };

  switch (operation) {
    case 'getAll': {
      return await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/clients`,
        headers,
        json: true,
      });
    }

    case 'get': {
      const clientId = this.getNodeParameter('clientId', itemIndex);
      return await this.helpers.httpRequest({
        method: 'GET',
        url: `${baseUrl}/clients/${clientId}`,
        headers,
        json: true,
      });
    }

    case 'create': {
      const createData: any = {
        name: this.getNodeParameter('name', itemIndex),
        email: this.getNodeParameter('email', itemIndex),
        phone: this.getNodeParameter('phone', itemIndex),
      };
      
      const cpf = this.getNodeParameter('cpf', itemIndex);
      if (cpf) createData.cpf = cpf;

      return await this.helpers.httpRequest({
        method: 'POST',
        url: `${baseUrl}/clients`,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: createData,
        json: true,
      });
    }

    case 'update': {
      const updateClientId = this.getNodeParameter('clientId', itemIndex);
      const updateData: any = {
        name: this.getNodeParameter('name', itemIndex),
        email: this.getNodeParameter('email', itemIndex),
        phone: this.getNodeParameter('phone', itemIndex),
      };
      
      const updateCpf = this.getNodeParameter('cpf', itemIndex);
      if (updateCpf) updateData.cpf = updateCpf;

      return await this.helpers.httpRequest({
        method: 'PUT',
        url: `${baseUrl}/clients/${updateClientId}`,
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: updateData,
        json: true,
      });
    }

    case 'delete': {
      const deleteClientId = this.getNodeParameter('clientId', itemIndex);
      return await this.helpers.httpRequest({
        method: 'DELETE',
        url: `${baseUrl}/clients/${deleteClientId}`,
        headers,
        json: true,
      });
    }

    default:
      throw new NodeOperationError(this.getNode(), `Unknown client operation: ${operation}`);
  }
}