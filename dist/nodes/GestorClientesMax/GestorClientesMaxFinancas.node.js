"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorClientesMaxFinancas = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class GestorClientesMaxFinancas {
    constructor() {
        this.description = {
            displayName: 'Gestor Clientes Max - Finanças',
            name: 'gestorClientesMaxFinancas',
            icon: 'file:gestorclientes.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter.operation}}',
            description: 'Gerenciar finanças: criar, buscar, atualizar contas financeiras, obter resumos e contas em atraso via API. Use para controle financeiro.',
            defaults: {
                name: 'Gestor Clientes Max - Finanças',
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
                            description: 'Criar nova conta financeira',
                            action: 'Criar conta financeira',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Buscar todas as contas financeiras',
                            action: 'Buscar todas as contas financeiras',
                        },
                        {
                            name: 'Get By ID',
                            value: 'get',
                            description: 'Buscar conta financeira por ID',
                            action: 'Buscar conta financeira por ID',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Atualizar conta financeira existente',
                            action: 'Atualizar conta financeira',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Deletar conta financeira',
                            action: 'Deletar conta financeira',
                        },
                        {
                            name: 'Get Summary',
                            value: 'getSummary',
                            description: 'Obter resumo financeiro',
                            action: 'Obter resumo financeiro',
                        },
                        {
                            name: 'Get Overdue',
                            value: 'getOverdue',
                            description: 'Buscar contas em atraso',
                            action: 'Buscar contas em atraso',
                        },
                    ],
                    default: 'getAll',
                },
                // Financial ID for get/update/delete operations
                {
                    displayName: 'Financial Account ID',
                    name: 'financialId',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['get', 'update', 'delete'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID da conta financeira',
                },
                // Financial Fields
                {
                    displayName: 'Tipo',
                    name: 'financialType',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    options: [
                        {
                            name: 'Receita (A Receber)',
                            value: 'receivable',
                        },
                        {
                            name: 'Despesa (A Pagar)',
                            value: 'payable',
                        },
                    ],
                    default: 'receivable',
                    required: true,
                    description: 'Tipo da conta financeira',
                },
                {
                    displayName: 'Descrição',
                    name: 'financialDescription',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Descrição da conta financeira',
                },
                {
                    displayName: 'Valor',
                    name: 'financialAmount',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Valor da conta (formato: 150.00)',
                },
                {
                    displayName: 'Data de Vencimento',
                    name: 'dueDate',
                    type: 'dateTime',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Data de vencimento da conta',
                },
                {
                    displayName: 'Categoria',
                    name: 'financialCategory',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Categoria da conta financeira',
                },
                {
                    displayName: 'Status',
                    name: 'financialStatus',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    options: [
                        {
                            name: 'Pendente',
                            value: 'pending',
                        },
                        {
                            name: 'Pago',
                            value: 'paid',
                        },
                        {
                            name: 'Vencido',
                            value: 'overdue',
                        },
                        {
                            name: 'Cancelado',
                            value: 'cancelled',
                        },
                    ],
                    default: 'pending',
                    description: 'Status da conta financeira',
                },
                {
                    displayName: 'Cliente ID (Opcional)',
                    name: 'financialClientId',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'ID do cliente associado à conta',
                },
                {
                    displayName: 'Agendamento ID (Opcional)',
                    name: 'financialAppointmentId',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'ID do agendamento associado à conta',
                },
                {
                    displayName: 'Método de Pagamento',
                    name: 'paymentMethod',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    options: [
                        {
                            name: 'Dinheiro',
                            value: 'cash',
                        },
                        {
                            name: 'PIX',
                            value: 'pix',
                        },
                        {
                            name: 'Cartão de Crédito',
                            value: 'credit_card',
                        },
                        {
                            name: 'Cartão de Débito',
                            value: 'debit_card',
                        },
                        {
                            name: 'Transferência',
                            value: 'transfer',
                        },
                    ],
                    default: '',
                    description: 'Método de pagamento utilizado',
                },
                {
                    displayName: 'Observações',
                    name: 'financialNotes',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'Observações sobre a conta financeira',
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
                responseData = await handleFinancialOperations.call(this, operation, i, credentials);
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
exports.GestorClientesMaxFinancas = GestorClientesMaxFinancas;
async function handleFinancialOperations(operation, itemIndex, credentials) {
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
                url: `${baseUrl}/financial-accounts`,
                headers,
                json: true,
            });
        }
        case 'get': {
            const financialId = this.getNodeParameter('financialId', itemIndex);
            return await this.helpers.httpRequest({
                method: 'GET',
                url: `${baseUrl}/financial-accounts/${financialId}`,
                headers,
                json: true,
            });
        }
        case 'getSummary': {
            return await this.helpers.httpRequest({
                method: 'GET',
                url: `${baseUrl}/financial-accounts/summary`,
                headers,
                json: true,
            });
        }
        case 'getOverdue': {
            return await this.helpers.httpRequest({
                method: 'GET',
                url: `${baseUrl}/financial-accounts/overdue`,
                headers,
                json: true,
            });
        }
        case 'create': {
            const dueDateParam = this.getNodeParameter('dueDate', itemIndex);
            const createData = {
                type: this.getNodeParameter('financialType', itemIndex),
                description: this.getNodeParameter('financialDescription', itemIndex),
                amount: this.getNodeParameter('financialAmount', itemIndex),
                dueDate: (dueDateParam === null || dueDateParam === void 0 ? void 0 : dueDateParam.split('T')[0]) || dueDateParam, // Convert to date only
                category: this.getNodeParameter('financialCategory', itemIndex),
                status: this.getNodeParameter('financialStatus', itemIndex),
            };
            const clientId = this.getNodeParameter('financialClientId', itemIndex);
            if (clientId)
                createData.clientId = clientId;
            const appointmentId = this.getNodeParameter('financialAppointmentId', itemIndex);
            if (appointmentId)
                createData.appointmentId = appointmentId;
            const paymentMethod = this.getNodeParameter('paymentMethod', itemIndex);
            if (paymentMethod)
                createData.paymentMethod = paymentMethod;
            const notes = this.getNodeParameter('financialNotes', itemIndex);
            if (notes)
                createData.notes = notes;
            return await this.helpers.httpRequest({
                method: 'POST',
                url: `${baseUrl}/financial-accounts`,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: createData,
                json: true,
            });
        }
        case 'update': {
            const updateFinancialId = this.getNodeParameter('financialId', itemIndex);
            const updateDueDateParam = this.getNodeParameter('dueDate', itemIndex);
            const updateData = {
                type: this.getNodeParameter('financialType', itemIndex),
                description: this.getNodeParameter('financialDescription', itemIndex),
                amount: this.getNodeParameter('financialAmount', itemIndex),
                dueDate: (updateDueDateParam === null || updateDueDateParam === void 0 ? void 0 : updateDueDateParam.split('T')[0]) || updateDueDateParam, // Convert to date only
                category: this.getNodeParameter('financialCategory', itemIndex),
                status: this.getNodeParameter('financialStatus', itemIndex),
            };
            const updateClientId = this.getNodeParameter('financialClientId', itemIndex);
            if (updateClientId)
                updateData.clientId = updateClientId;
            const updateAppointmentId = this.getNodeParameter('financialAppointmentId', itemIndex);
            if (updateAppointmentId)
                updateData.appointmentId = updateAppointmentId;
            const updatePaymentMethod = this.getNodeParameter('paymentMethod', itemIndex);
            if (updatePaymentMethod)
                updateData.paymentMethod = updatePaymentMethod;
            const updateNotes = this.getNodeParameter('financialNotes', itemIndex);
            if (updateNotes)
                updateData.notes = updateNotes;
            return await this.helpers.httpRequest({
                method: 'PUT',
                url: `${baseUrl}/financial-accounts/${updateFinancialId}`,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: updateData,
                json: true,
            });
        }
        case 'delete': {
            const deleteFinancialId = this.getNodeParameter('financialId', itemIndex);
            return await this.helpers.httpRequest({
                method: 'DELETE',
                url: `${baseUrl}/financial-accounts/${deleteFinancialId}`,
                headers,
                json: true,
            });
        }
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown financial operation: ${operation}`);
    }
}
//# sourceMappingURL=GestorClientesMaxFinancas.node.js.map