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
    displayName: 'Agenda API Simple',
    name: 'agendaApiSimple',
    icon: 'file:agenda.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter.resource + ": " + $parameter.operation}}',
    description: 'Simple integration with Agenda API for managing clients and appointments',
    defaults: {
      name: 'Agenda API Simple',
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
            name: 'Client',
            value: 'client',
          },
          {
            name: 'Appointment',
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
            name: 'Get All',
            value: 'getAll',
            description: 'Get all clients',
            action: 'Get all clients',
          },
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new client',
            action: 'Create a client',
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
            name: 'Get All',
            value: 'getAll',
            description: 'Get all appointments',
            action: 'Get all appointments',
          },
        ],
        default: 'getAll',
      },
      {
        displayName: 'API Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://agenda.anthonymax.com/api',
        description: 'Base URL for the Agenda API',
      },
      {
        displayName: 'Name',
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
        description: 'Client name',
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
        description: 'Client email address',
      },
      {
        displayName: 'Phone',
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
        description: 'Client phone number',
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