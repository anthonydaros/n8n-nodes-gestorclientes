"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestorClientesMaxAgendamento = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class GestorClientesMaxAgendamento {
    constructor() {
        this.description = {
            displayName: 'Gestor Clientes Max - Agendamento',
            name: 'gestorClientesMaxAgendamento',
            icon: 'file:gestorclientes.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter.operation}}',
            description: 'Gerenciar agendamentos: criar, buscar, atualizar e deletar agendamentos via API. Use para operações de scheduling e consultas.',
            defaults: {
                name: 'Gestor Clientes Max - Agendamento',
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
                            description: 'Criar um novo agendamento',
                            action: 'Criar agendamento',
                        },
                        {
                            name: 'Get All',
                            value: 'getAll',
                            description: 'Buscar todos os agendamentos',
                            action: 'Buscar todos os agendamentos',
                        },
                        {
                            name: 'Get By ID',
                            value: 'get',
                            description: 'Buscar agendamento por ID',
                            action: 'Buscar agendamento por ID',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Atualizar agendamento existente',
                            action: 'Atualizar agendamento',
                        },
                        {
                            name: 'Delete',
                            value: 'delete',
                            description: 'Deletar agendamento',
                            action: 'Deletar agendamento',
                        },
                    ],
                    default: 'getAll',
                },
                // Appointment ID for get/update/delete operations
                {
                    displayName: 'Appointment ID',
                    name: 'appointmentId',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['get', 'update', 'delete'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'ID do agendamento',
                },
                // Appointment Fields
                {
                    displayName: 'Título',
                    name: 'title',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Título do agendamento',
                },
                {
                    displayName: 'Descrição',
                    name: 'description',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'Descrição do agendamento',
                },
                {
                    displayName: 'Data/Hora Início',
                    name: 'startTime',
                    type: 'dateTime',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Data e hora de início do agendamento',
                },
                {
                    displayName: 'Data/Hora Fim',
                    name: 'endTime',
                    type: 'dateTime',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    required: true,
                    description: 'Data e hora de fim do agendamento',
                },
                {
                    displayName: 'Status',
                    name: 'status',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    options: [
                        {
                            name: 'Agendado',
                            value: 'agendado',
                        },
                        {
                            name: 'Confirmado',
                            value: 'confirmado',
                        },
                        {
                            name: 'Concluído',
                            value: 'concluido',
                        },
                        {
                            name: 'Cancelado',
                            value: 'cancelado',
                        },
                    ],
                    default: 'agendado',
                    description: 'Status do agendamento',
                },
                {
                    displayName: 'Client ID (Opcional)',
                    name: 'appointmentClientId',
                    type: 'number',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'ID do cliente associado ao agendamento',
                },
                {
                    displayName: 'Preço da Consulta',
                    name: 'consultationPrice',
                    type: 'string',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    default: '',
                    description: 'Preço da consulta (formato: 150.00)',
                },
                {
                    displayName: 'Prioridade',
                    name: 'priority',
                    type: 'options',
                    displayOptions: {
                        show: {
                            operation: ['create', 'update'],
                        },
                    },
                    options: [
                        {
                            name: 'Normal',
                            value: 'normal',
                        },
                        {
                            name: 'Alta',
                            value: 'alta',
                        },
                        {
                            name: 'Baixa',
                            value: 'baixa',
                        },
                    ],
                    default: 'normal',
                    description: 'Prioridade do agendamento',
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
                responseData = await handleAppointmentOperations.call(this, operation, i, credentials);
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
exports.GestorClientesMaxAgendamento = GestorClientesMaxAgendamento;
async function handleAppointmentOperations(operation, itemIndex, credentials) {
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
                url: `${baseUrl}/appointments`,
                headers,
                json: true,
            });
        }
        case 'get': {
            const appointmentId = this.getNodeParameter('appointmentId', itemIndex);
            return await this.helpers.httpRequest({
                method: 'GET',
                url: `${baseUrl}/appointments/${appointmentId}`,
                headers,
                json: true,
            });
        }
        case 'create': {
            const createData = {
                title: this.getNodeParameter('title', itemIndex),
                startTime: this.getNodeParameter('startTime', itemIndex),
                endTime: this.getNodeParameter('endTime', itemIndex),
                status: this.getNodeParameter('status', itemIndex),
                priority: this.getNodeParameter('priority', itemIndex),
            };
            const description = this.getNodeParameter('description', itemIndex);
            if (description)
                createData.description = description;
            const clientId = this.getNodeParameter('appointmentClientId', itemIndex);
            if (clientId)
                createData.clientId = clientId;
            const consultationPrice = this.getNodeParameter('consultationPrice', itemIndex);
            if (consultationPrice)
                createData.consultationPrice = consultationPrice;
            return await this.helpers.httpRequest({
                method: 'POST',
                url: `${baseUrl}/appointments`,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: createData,
                json: true,
            });
        }
        case 'update': {
            const updateAppointmentId = this.getNodeParameter('appointmentId', itemIndex);
            const updateData = {
                title: this.getNodeParameter('title', itemIndex),
                startTime: this.getNodeParameter('startTime', itemIndex),
                endTime: this.getNodeParameter('endTime', itemIndex),
                status: this.getNodeParameter('status', itemIndex),
                priority: this.getNodeParameter('priority', itemIndex),
            };
            const updateDescription = this.getNodeParameter('description', itemIndex);
            if (updateDescription)
                updateData.description = updateDescription;
            const updateClientId = this.getNodeParameter('appointmentClientId', itemIndex);
            if (updateClientId)
                updateData.clientId = updateClientId;
            const updateConsultationPrice = this.getNodeParameter('consultationPrice', itemIndex);
            if (updateConsultationPrice)
                updateData.consultationPrice = updateConsultationPrice;
            return await this.helpers.httpRequest({
                method: 'PUT',
                url: `${baseUrl}/appointments/${updateAppointmentId}`,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: updateData,
                json: true,
            });
        }
        case 'delete': {
            const deleteAppointmentId = this.getNodeParameter('appointmentId', itemIndex);
            return await this.helpers.httpRequest({
                method: 'DELETE',
                url: `${baseUrl}/appointments/${deleteAppointmentId}`,
                headers,
                json: true,
            });
        }
        default:
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Unknown appointment operation: ${operation}`);
    }
}
//# sourceMappingURL=GestorClientesMaxAgendamento.node.js.map