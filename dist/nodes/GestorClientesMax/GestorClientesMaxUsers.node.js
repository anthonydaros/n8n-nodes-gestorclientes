"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorClientesMaxUsers = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class GestorClientesMaxUsers {
    constructor() {
        this.description = {
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
            inputs: [
                {
                    displayName: '',
                    type: "main" /* NodeConnectionType.Main */,
                },
            ],
            outputs: [
                {
                    displayName: '',
                    type: "main" /* NodeConnectionType.Main */,
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
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const credentials = await this.getCredentials('gestorClientesMaxApi');
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                let responseData;
                responseData = await handleUsersOperations.call(this, operation, i, credentials);
                if (!responseData) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
                }
                returnData.push({
                    json: responseData,
                    pairedItem: {
                        item: i,
                    },
                });
            }
            catch (error) {
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
exports.GestorClientesMaxUsers = GestorClientesMaxUsers;
async function handleUsersOperations(operation, itemIndex, credentials) {
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
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown users operation: ${operation}`);
    }
}
//# sourceMappingURL=GestorClientesMaxUsers.node.js.map