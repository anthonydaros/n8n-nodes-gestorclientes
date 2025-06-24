import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

export class ExampleNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Example Node',
    name: 'exampleNode',
    icon: 'file:example.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter.operation}}',
    description: 'Node de exemplo para demonstrar a estrutura básica',
    defaults: {
      name: 'Example Node',
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
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Transform Text',
            value: 'transform',
            description: 'Transform input text',
            action: 'Transform text',
          },
          {
            name: 'Count Items',
            value: 'count',
            description: 'Count number of items',
            action: 'Count items',
          },
        ],
        default: 'transform',
      },
      {
        displayName: 'Text Operation',
        name: 'textOperation',
        type: 'options',
        displayOptions: {
          show: {
            operation: ['transform'],
          },
        },
        options: [
          {
            name: 'Uppercase',
            value: 'uppercase',
          },
          {
            name: 'Lowercase',
            value: 'lowercase',
          },
          {
            name: 'Capitalize',
            value: 'capitalize',
          },
        ],
        default: 'uppercase',
        description: 'How to transform the text',
      },
      {
        displayName: 'Input Field',
        name: 'inputField',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['transform'],
          },
        },
        default: 'data',
        description: 'Field name to transform',
      },
      {
        displayName: 'Output Field',
        name: 'outputField',
        type: 'string',
        displayOptions: {
          show: {
            operation: ['transform'],
          },
        },
        default: 'transformedData',
        description: 'Field name for output',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const operation = this.getNodeParameter('operation', 0) as string;
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        let outputData: any = { ...items[i].json };

        switch (operation) {
          case 'transform':
            const textOperation = this.getNodeParameter('textOperation', i) as string;
            const inputField = this.getNodeParameter('inputField', i) as string;
            const outputField = this.getNodeParameter('outputField', i) as string;
            
            const inputValue = items[i].json[inputField];
            if (typeof inputValue === 'string') {
              let transformedValue: string;
              
              switch (textOperation) {
                case 'uppercase':
                  transformedValue = inputValue.toUpperCase();
                  break;
                case 'lowercase':
                  transformedValue = inputValue.toLowerCase();
                  break;
                case 'capitalize':
                  transformedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
                  break;
                default:
                  transformedValue = inputValue;
              }
              
              outputData[outputField] = transformedValue;
            } else {
              throw new Error(`Field '${inputField}' is not a string`);
            }
            break;

          case 'count':
            outputData = {
              count: items.length,
              itemIndex: i,
              totalItems: items.length,
            };
            break;

          default:
            throw new Error(`Unknown operation: ${operation}`);
        }

        returnData.push({
          json: outputData,
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