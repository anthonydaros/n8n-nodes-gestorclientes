import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class GestorClientesMax implements INodeType {
  description: INodeTypeDescription = {
      displayName: 'Gestor Clientes Max',
      name: 'gestorClientesMax',
      icon: 'file:gestorclientes.svg',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter.resource + ": " + $parameter.operation}}',
      description: 'Integração completa com API de agenda para gerenciar clientes e agendamentos',
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
      credentials: [
        {
          name: 'gestorClientesMaxApi',
          required: true,
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
            {
              name: 'Finanças',
              value: 'financial',
            },
          ],
          default: 'client',
        },
        
        // Client Operations
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

        // Appointment Operations
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

        // Financial Operations
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          displayOptions: {
            show: {
              resource: ['financial'],
            },
          },
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

        // Client ID for get/update/delete operations
        {
          displayName: 'Client ID',
          name: 'clientId',
          type: 'number',
          displayOptions: {
            show: {
              resource: ['client'],
              operation: ['get', 'update', 'delete'],
            },
          },
          default: '',
          required: true,
          description: 'ID do cliente',
        },

        // Appointment ID for get/update/delete operations
        {
          displayName: 'Appointment ID',
          name: 'appointmentId',
          type: 'number',
          displayOptions: {
            show: {
              resource: ['appointment'],
              operation: ['get', 'update', 'delete'],
            },
          },
          default: '',
          required: true,
          description: 'ID do agendamento',
        },

        // Financial ID for get/update/delete operations
        {
          displayName: 'Financial Account ID',
          name: 'financialId',
          type: 'number',
          displayOptions: {
            show: {
              resource: ['financial'],
              operation: ['get', 'update', 'delete'],
            },
          },
          default: '',
          required: true,
          description: 'ID da conta financeira',
        },

        // Client Fields
        {
          displayName: 'Nome',
          name: 'name',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['client'],
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
              resource: ['client'],
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
              resource: ['client'],
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
              resource: ['client'],
              operation: ['create', 'update'],
            },
          },
          default: '',
          description: 'CPF do cliente',
        },

        // Appointment Fields
        {
          displayName: 'Título',
          name: 'title',
          type: 'string',
          displayOptions: {
            show: {
              resource: ['appointment'],
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
              resource: ['appointment'],
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
              resource: ['appointment'],
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
              resource: ['appointment'],
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
              resource: ['appointment'],
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
              resource: ['appointment'],
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
              resource: ['appointment'],
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
              resource: ['appointment'],
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

        // Financial Fields
        {
          displayName: 'Tipo',
          name: 'financialType',
          type: 'options',
          displayOptions: {
            show: {
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
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
              resource: ['financial'],
              operation: ['create', 'update'],
            },
          },
          default: '',
          description: 'Observações sobre a conta financeira',
        },
      ],
    };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData = [];
    const credentials = await this.getCredentials('gestorClientesMaxApi');

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i);
        const operation = this.getNodeParameter('operation', i);

        let responseData;

        if (resource === 'client') {
          responseData = await handleClientOperations.call(this, operation, i, credentials);
        } else if (resource === 'appointment') {
          responseData = await handleAppointmentOperations.call(this, operation, i, credentials);
        } else if (resource === 'financial') {
          responseData = await handleFinancialOperations.call(this, operation, i, credentials);
        }

        if (!responseData) {
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${resource}.${operation}`);
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
        });      }



      default:
        throw new NodeOperationError(this.getNode(), `Unknown client operation: ${operation}`);
    }
}

async function handleAppointmentOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials: any) {
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
        const createData: any = {
          title: this.getNodeParameter('title', itemIndex),
          startTime: this.getNodeParameter('startTime', itemIndex),
          endTime: this.getNodeParameter('endTime', itemIndex),
          status: this.getNodeParameter('status', itemIndex),
          priority: this.getNodeParameter('priority', itemIndex),
        };

        const description = this.getNodeParameter('description', itemIndex);
        if (description) createData.description = description;

        const clientId = this.getNodeParameter('appointmentClientId', itemIndex);
        if (clientId) createData.clientId = clientId;

        const consultationPrice = this.getNodeParameter('consultationPrice', itemIndex);
        if (consultationPrice) createData.consultationPrice = consultationPrice;

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
        const updateData: any = {
          title: this.getNodeParameter('title', itemIndex),
          startTime: this.getNodeParameter('startTime', itemIndex),
          endTime: this.getNodeParameter('endTime', itemIndex),
          status: this.getNodeParameter('status', itemIndex),
          priority: this.getNodeParameter('priority', itemIndex),
        };

        const updateDescription = this.getNodeParameter('description', itemIndex);
        if (updateDescription) updateData.description = updateDescription;

        const updateClientId = this.getNodeParameter('appointmentClientId', itemIndex);
        if (updateClientId) updateData.clientId = updateClientId;

        const updateConsultationPrice = this.getNodeParameter('consultationPrice', itemIndex);
        if (updateConsultationPrice) updateData.consultationPrice = updateConsultationPrice;

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
        });      }



      default:
        throw new NodeOperationError(this.getNode(), `Unknown appointment operation: ${operation}`);
    }
}

async function handleFinancialOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials: any) {
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
        const dueDateParam = this.getNodeParameter('dueDate', itemIndex) as string;
        const createData: any = {
          type: this.getNodeParameter('financialType', itemIndex),
          description: this.getNodeParameter('financialDescription', itemIndex),
          amount: this.getNodeParameter('financialAmount', itemIndex),
          dueDate: dueDateParam?.split('T')[0] || dueDateParam, // Convert to date only
          category: this.getNodeParameter('financialCategory', itemIndex),
          status: this.getNodeParameter('financialStatus', itemIndex),
        };

        const clientId = this.getNodeParameter('financialClientId', itemIndex);
        if (clientId) createData.clientId = clientId;

        const appointmentId = this.getNodeParameter('financialAppointmentId', itemIndex);
        if (appointmentId) createData.appointmentId = appointmentId;

        const paymentMethod = this.getNodeParameter('paymentMethod', itemIndex);
        if (paymentMethod) createData.paymentMethod = paymentMethod;

        const notes = this.getNodeParameter('financialNotes', itemIndex);
        if (notes) createData.notes = notes;

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
        const updateDueDateParam = this.getNodeParameter('dueDate', itemIndex) as string;
        const updateData: any = {
          type: this.getNodeParameter('financialType', itemIndex),
          description: this.getNodeParameter('financialDescription', itemIndex),
          amount: this.getNodeParameter('financialAmount', itemIndex),
          dueDate: updateDueDateParam?.split('T')[0] || updateDueDateParam, // Convert to date only
          category: this.getNodeParameter('financialCategory', itemIndex),
          status: this.getNodeParameter('financialStatus', itemIndex),
        };

        const updateClientId = this.getNodeParameter('financialClientId', itemIndex);
        if (updateClientId) updateData.clientId = updateClientId;

        const updateAppointmentId = this.getNodeParameter('financialAppointmentId', itemIndex);
        if (updateAppointmentId) updateData.appointmentId = updateAppointmentId;

        const updatePaymentMethod = this.getNodeParameter('paymentMethod', itemIndex);
        if (updatePaymentMethod) updateData.paymentMethod = updatePaymentMethod;

        const updateNotes = this.getNodeParameter('financialNotes', itemIndex);
        if (updateNotes) updateData.notes = updateNotes;

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
        });      }



      default:
        throw new NodeOperationError(this.getNode(), `Unknown financial operation: ${operation}`);
    }
}

