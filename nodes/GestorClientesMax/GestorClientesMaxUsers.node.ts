import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class GestorClientesMaxUsers implements INodeType {
  description: INodeTypeDescription = {
      displayName: 'Gestor Clientes Max - Users',
      name: 'gestorClientesMaxUsers',
      icon: 'file:gestorclientes.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter.operation}}',
      description: 'Operações com usuários da API de agenda',
      defaults: {
        name: 'Gestor Clientes Max - Users',
      },
      usableAsTool: true,
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
              name: 'Get All Public',
              value: 'getAllPublic',
              description: 'Buscar todos os usuários públicos',
              action: 'Buscar todos os usuários públicos',
            },
          ],
          default: 'getAllPublic',
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

        responseData = await handleUsersOperations.call(this, operation, i, credentials);

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

async function handleUsersOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials: any) {
    const baseUrl = credentials.baseUrl;
    const apiKey = credentials.apiKey;

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    };

    switch (operation) {
      case 'getAllPublic': {
        return await this.helpers.httpRequest({
          method: 'GET',
          url: `${baseUrl}/public/users`,
          headers,
          json: true,
        });
      }

      default:
        throw new NodeOperationError(this.getNode(), `Unknown users operation: ${operation}`);
    }
} 