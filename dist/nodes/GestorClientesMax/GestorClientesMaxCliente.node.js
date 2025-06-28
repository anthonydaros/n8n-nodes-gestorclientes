"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorClientesMaxCliente = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class GestorClientesMaxCliente {
    constructor() {
        this.description = {
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
                    type: "main" /* NodeConnectionType.Main */,
                },
            ],
            outputs: [
                {
                    displayName: '',
                    type: "main" /* NodeConnectionType.Main */,
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
                // User ID - Required for create operation
                {
                    displayName: 'User ID',
                    name: 'userId',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID do usuário (obrigatório para Super Admin)',
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
                    description: 'Nome do cliente (obrigatório)',
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
                {
                    displayName: 'Data de Nascimento',
                    name: 'birthDate',
                    type: 'dateTime',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'Data de nascimento do cliente (formato: YYYY-MM-DD)',
                },
                {
                    displayName: 'Endereço',
                    name: 'address',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'Endereço completo do cliente',
                },
                {
                    displayName: 'Preço da Consulta',
                    name: 'consultationPrice',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: 0,
                    description: 'Preço da consulta em reais',
                },
                {
                    displayName: 'Status de Pagamento',
                    name: 'paymentStatus',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    options: [
                        {
                            name: 'A Pagar',
                            value: 'a_pagar',
                        },
                        {
                            name: 'Pago',
                            value: 'pago',
                        },
                        {
                            name: 'Cancelado',
                            value: 'cancelado',
                        },
                    ],
                    default: 'a_pagar',
                    description: 'Status do pagamento',
                },
                {
                    displayName: 'Observações',
                    name: 'notes',
                    type: 'string',
                    typeOptions: {
                        rows: 3,
                    },
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'Observações sobre o cliente',
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
                responseData = await handleClientOperations.call(this, operation, i, credentials);
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
exports.GestorClientesMaxCliente = GestorClientesMaxCliente;
async function handleClientOperations(operation, itemIndex, credentials) {
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
            const createData = {
                userId: this.getNodeParameter('userId', itemIndex),
                name: this.getNodeParameter('name', itemIndex),
            };
            // Campos opcionais
            const email = this.getNodeParameter('email', itemIndex);
            if (email)
                createData.email = email;
            const phone = this.getNodeParameter('phone', itemIndex);
            if (phone)
                createData.phone = phone;
            const cpf = this.getNodeParameter('cpf', itemIndex);
            if (cpf)
                createData.cpf = cpf;
            const birthDate = this.getNodeParameter('birthDate', itemIndex);
            if (birthDate) {
                // Converter para formato YYYY-MM-DD se necessário
                const date = new Date(birthDate);
                createData.birthDate = date.toISOString().split('T')[0];
            }
            const address = this.getNodeParameter('address', itemIndex);
            if (address)
                createData.address = address;
            const consultationPrice = this.getNodeParameter('consultationPrice', itemIndex);
            if (consultationPrice && consultationPrice > 0)
                createData.consultationPrice = consultationPrice;
            const paymentStatus = this.getNodeParameter('paymentStatus', itemIndex);
            if (paymentStatus)
                createData.paymentStatus = paymentStatus;
            const notes = this.getNodeParameter('notes', itemIndex);
            if (notes)
                createData.notes = notes;
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
            const updateData = {
                userId: this.getNodeParameter('userId', itemIndex),
                name: this.getNodeParameter('name', itemIndex),
            };
            // Campos opcionais
            const email = this.getNodeParameter('email', itemIndex);
            if (email)
                updateData.email = email;
            const phone = this.getNodeParameter('phone', itemIndex);
            if (phone)
                updateData.phone = phone;
            const cpf = this.getNodeParameter('cpf', itemIndex);
            if (cpf)
                updateData.cpf = cpf;
            const birthDate = this.getNodeParameter('birthDate', itemIndex);
            if (birthDate) {
                // Converter para formato YYYY-MM-DD se necessário
                const date = new Date(birthDate);
                updateData.birthDate = date.toISOString().split('T')[0];
            }
            const address = this.getNodeParameter('address', itemIndex);
            if (address)
                updateData.address = address;
            const consultationPrice = this.getNodeParameter('consultationPrice', itemIndex);
            if (consultationPrice && consultationPrice > 0)
                updateData.consultationPrice = consultationPrice;
            const paymentStatus = this.getNodeParameter('paymentStatus', itemIndex);
            if (paymentStatus)
                updateData.paymentStatus = paymentStatus;
            const notes = this.getNodeParameter('notes', itemIndex);
            if (notes)
                updateData.notes = notes;
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
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown client operation: ${operation}`);
    }
}
//# sourceMappingURL=GestorClientesMaxCliente.node.js.map