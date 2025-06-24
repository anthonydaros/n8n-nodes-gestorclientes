import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IHttpRequestOptions,
  NodeConnectionType,
} from 'n8n-workflow';

export class AgendaApiSimple implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Gestor Clientes Max',
    name: 'gestorClientesMax',
    icon: 'fa:calendar-check',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter.resource + ": " + $parameter.operation}}',
    description: 'Integração com API de agenda para gerenciar clientes e agendamentos',
    defaults: {
      name: 'Gestor Clientes Max',
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
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Cliente',
            value: 'client',
          },
          {
            name: 'Agendamento',
            value: 'appointment',
          },
        ],
        default: 'client',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['client'],
          },
        },
        options: [
          {
            name: 'Buscar Todos',
            value: 'getAll',
            description: 'Buscar todos os clientes',
            action: 'Buscar todos os clientes',
          },
          {
            name: 'Criar',
            value: 'create',
            description: 'Criar um novo cliente',
            action: 'Criar um cliente',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['appointment'],
          },
        },
        options: [
          {
            name: 'Buscar Todos',
            value: 'getAll',
            description: 'Buscar todos os agendamentos',
            action: 'Buscar todos os agendamentos',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'URL Base da API',
        name: 'baseUrl',
        type: 'string',
        default: 'https://agenda.anthonymax.com/api',
        description: 'URL base para a API de Agenda',
      },
      {
        displayName: 'Nome',
        name: 'name',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['client'],
            operation: ['create'],
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
            resource: ['client'],
            operation: ['create'],
          },
        },
        default: '',
        required: true,
        description: 'Endereço de email do cliente',
      },
      {
        displayName: 'Telefone',
        name: 'phone',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['client'],
            operation: ['create'],
          },
        },
        default: '',
        required: true,
        description: 'Número de telefone do cliente',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i) as string;
        const operation = this.getNodeParameter('operation', i) as string;
        const baseUrl = this.getNodeParameter('baseUrl', i) as string;

        let responseData;

        if (resource === 'client') {
          if (operation === 'getAll') {
            const options: IHttpRequestOptions = {
              method: 'GET',
              url: `${baseUrl}/clients`,
              headers: {
                'Accept': 'application/json',
              },
              json: true,
            };
            responseData = await this.helpers.httpRequest(options);
          } else if (operation === 'create') {
            const name = this.getNodeParameter('name', i) as string;
            const email = this.getNodeParameter('email', i) as string;
            const phone = this.getNodeParameter('phone', i) as string;

            const options: IHttpRequestOptions = {
              method: 'POST',
              url: `${baseUrl}/clients`,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              },
              body: {
                name,
                email,
                phone,
              },
              json: true,
            };
            responseData = await this.helpers.httpRequest(options);
          }
        } else if (resource === 'appointment') {
          if (operation === 'getAll') {
            const options: IHttpRequestOptions = {
              method: 'GET',
              url: `${baseUrl}/appointments`,
              headers: {
                'Accept': 'application/json',
              },
              json: true,
            };
            responseData = await this.helpers.httpRequest(options);
          }
        }

        if (!responseData) {
          throw new Error(`Unknown operation: ${resource}.${operation}`);
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