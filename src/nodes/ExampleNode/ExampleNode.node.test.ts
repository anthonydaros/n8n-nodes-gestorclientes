import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ExampleNode } from './ExampleNode.node';

describe('ExampleNode', () => {
  let exampleNode: ExampleNode;
  let mockExecuteFunctions: Partial<IExecuteFunctions>;

  beforeEach(() => {
    exampleNode = new ExampleNode();
    mockExecuteFunctions = {
      getInputData: jest.fn(),
      getNodeParameter: jest.fn(),
      continueOnFail: jest.fn().mockReturnValue(false),
    };
  });

  describe('Node Description', () => {
    it('should have correct basic properties', () => {
      expect(exampleNode.description.displayName).toBe('Example Node');
      expect(exampleNode.description.name).toBe('exampleNode');
      expect(exampleNode.description.group).toEqual(['transform']);
      expect(exampleNode.description.version).toBe(1);
    });

    it('should have correct inputs and outputs', () => {
      expect(exampleNode.description.inputs).toHaveLength(1);
      expect(exampleNode.description.outputs).toHaveLength(1);
    });

    it('should have operation property', () => {
      const operationProperty = exampleNode.description.properties.find(
        prop => prop.name === 'operation'
      );
      expect(operationProperty).toBeDefined();
      expect(operationProperty?.type).toBe('options');
      expect(operationProperty?.default).toBe('transform');
    });
  });

  describe('Transform Operation', () => {
    beforeEach(() => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockImplementation((paramName: string) => {
          switch (paramName) {
            case 'operation':
              return 'transform';
            case 'textOperation':
              return 'uppercase';
            case 'inputField':
              return 'text';
            case 'outputField':
              return 'transformedText';
            default:
              return undefined;
          }
        });
    });

    it('should transform text to uppercase', async () => {
      const inputData: INodeExecutionData[] = [
        {
          json: {
            text: 'hello world',
          },
        },
      ];

      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

      const result = await exampleNode.execute.call(
        mockExecuteFunctions as IExecuteFunctions
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0].json.transformedText).toBe('HELLO WORLD');
      expect(result[0][0].json.text).toBe('hello world'); // Original should remain
    });

    it('should transform text to lowercase', async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockImplementation((paramName: string) => {
          switch (paramName) {
            case 'operation':
              return 'transform';
            case 'textOperation':
              return 'lowercase';
            case 'inputField':
              return 'text';
            case 'outputField':
              return 'transformedText';
            default:
              return undefined;
          }
        });

      const inputData: INodeExecutionData[] = [
        {
          json: {
            text: 'HELLO WORLD',
          },
        },
      ];

      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

      const result = await exampleNode.execute.call(
        mockExecuteFunctions as IExecuteFunctions
      );

      expect(result[0][0].json.transformedText).toBe('hello world');
    });

    it('should capitalize text', async () => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockImplementation((paramName: string) => {
          switch (paramName) {
            case 'operation':
              return 'transform';
            case 'textOperation':
              return 'capitalize';
            case 'inputField':
              return 'text';
            case 'outputField':
              return 'transformedText';
            default:
              return undefined;
          }
        });

      const inputData: INodeExecutionData[] = [
        {
          json: {
            text: 'hello WORLD',
          },
        },
      ];

      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

      const result = await exampleNode.execute.call(
        mockExecuteFunctions as IExecuteFunctions
      );

      expect(result[0][0].json.transformedText).toBe('Hello world');
    });

    it('should throw error for non-string input', async () => {
      const inputData: INodeExecutionData[] = [
        {
          json: {
            text: 123, // Non-string value
          },
        },
      ];

      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

      await expect(
        exampleNode.execute.call(mockExecuteFunctions as IExecuteFunctions)
      ).rejects.toThrow("Field 'text' is not a string");
    });
  });

  describe('Count Operation', () => {
    beforeEach(() => {
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockImplementation((paramName: string) => {
          if (paramName === 'operation') {
            return 'count';
          }
          return undefined;
        });
    });

    it('should count items correctly', async () => {
      const inputData: INodeExecutionData[] = [
        { json: { id: 1 } },
        { json: { id: 2 } },
        { json: { id: 3 } },
      ];

      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

      const result = await exampleNode.execute.call(
        mockExecuteFunctions as IExecuteFunctions
      );

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(3);
      
      // Check first item
      expect(result[0][0].json).toEqual({
        count: 3,
        itemIndex: 0,
        totalItems: 3,
      });

      // Check last item
      expect(result[0][2].json).toEqual({
        count: 3,
        itemIndex: 2,
        totalItems: 3,
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle continue on fail', async () => {
      (mockExecuteFunctions.continueOnFail as jest.Mock).mockReturnValue(true);
      (mockExecuteFunctions.getNodeParameter as jest.Mock)
        .mockImplementation((paramName: string) => {
          if (paramName === 'operation') {
            return 'invalid_operation';
          }
          return undefined;
        });

      const inputData: INodeExecutionData[] = [
        { json: { test: 'data' } },
      ];

      (mockExecuteFunctions.getInputData as jest.Mock).mockReturnValue(inputData);

      const result = await exampleNode.execute.call(
        mockExecuteFunctions as IExecuteFunctions
      );

      expect(result[0][0].json.error).toContain('Unknown operation');
    });
  });
}); 