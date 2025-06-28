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
      description: 'Operações completas de CRUD para usuários, clientes, agendamentos e finanças da API de agenda com suporte a userId',
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
              name: 'Get All Public Users',
              value: 'getAllPublic',
              description: 'Buscar todos os usuários públicos',
              action: 'Buscar todos os usuários públicos',
            },
            // Operações de Clientes
            {
              name: 'Get All Clients',
              value: 'getAllClients',
              description: 'Listar todos os clientes (com suporte a userId)',
              action: 'Listar todos os clientes',
            },
            {
              name: 'Create Client',
              value: 'createClient',
              description: 'Criar novo cliente (com suporte a userId)',
              action: 'Criar cliente',
            },
            // Operações de Agendamentos
            {
              name: 'Get All Appointments',
              value: 'getAllAppointments',
              description: 'Listar agendamentos (com suporte a userId)',
              action: 'Listar agendamentos',
            },
            {
              name: 'Create Appointment',
              value: 'createAppointment',
              description: 'Criar agendamento (com suporte a userId)',
              action: 'Criar agendamento',
            },
            {
              name: 'Update Appointment',
              value: 'updateAppointment',
              description: 'Atualizar agendamento completo',
              action: 'Atualizar agendamento',
            },
            // Operações Financeiras
            {
              name: 'Get All Financial',
              value: 'getAllFinancial',
              description: 'Listar contas financeiras (com suporte a userId)',
              action: 'Listar contas financeiras',
            },
            {
              name: 'Create Financial',
              value: 'createFinancial',
              description: 'Criar conta financeira (com suporte a userId)',
              action: 'Criar conta financeira',
            },
          ],
          default: 'getAllPublic',
        },

        // User ID (opcional para Super Admin)
        {
          displayName: 'User ID',
          name: 'userId',
          type: 'string',
          displayOptions: {
            show: {
              operation: [
                'getAllClients',
                'createClient', 
                'getAllAppointments',
                'createAppointment',
                'updateAppointment',
                'getAllFinancial',
                'createFinancial'
              ],
            },
          },
          default: '',
          description: 'ID do usuário (opcional - apenas para Super Admin via API key)',
        },

        // Parâmetros para busca de clientes
        {
          displayName: 'Search Term',
          name: 'search',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['getAllClients'],
            },
          },
          default: '',
          description: 'Termo de busca para filtrar clientes por nome, email ou telefone',
        },

        // Campos para criação de cliente
        {
          displayName: 'Client Name',
          name: 'clientName',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          required: true,
          description: 'Nome do cliente',
        },
        {
          displayName: 'Client Email',
          name: 'clientEmail',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          description: 'Email do cliente',
        },
        {
          displayName: 'Client Phone',
          name: 'clientPhone',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          description: 'Telefone do cliente',
        },
        {
          displayName: 'Client CPF',
          name: 'clientCpf',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          description: 'CPF do cliente',
        },
        {
          displayName: 'Birth Date',
          name: 'birthDate',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          description: 'Data de nascimento (YYYY-MM-DD)',
        },
        {
          displayName: 'Address',
          name: 'address',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          description: 'Endereço do cliente',
        },
        {
          displayName: 'Consultation Price',
          name: 'consultationPrice',
          type: 'number',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: 0,
          description: 'Preço da consulta',
        },
        {
          displayName: 'Payment Status',
          name: 'paymentStatus',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          options: [
            { name: 'A Pagar', value: 'a_pagar' },
            { name: 'Pago', value: 'pago' },
            { name: 'Pendente', value: 'pendente' },
          ],
          default: 'a_pagar',
          description: 'Status de pagamento',
        },
        {
          displayName: 'Notes',
          name: 'clientNotes',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createClient'],
            },
          },
          default: '',
          description: 'Observações sobre o cliente',
        },

        // Parâmetros para agendamentos
        {
          displayName: 'Start Date',
          name: 'startDate',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['getAllAppointments'],
            },
          },
          default: '',
          description: 'Data de início do período (YYYY-MM-DD)',
        },
        {
          displayName: 'End Date',
          name: 'endDate',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['getAllAppointments'],
            },
          },
          default: '',
          description: 'Data de fim do período (YYYY-MM-DD)',
        },

        // Campos para criação/atualização de agendamento
        {
          displayName: 'Appointment ID',
          name: 'appointmentId',
          type: 'number',
          displayOptions: {
            show: {
              operation: ['updateAppointment'],
            },
          },
          default: '',
          required: true,
          description: 'ID do agendamento a ser atualizado',
        },
        {
          displayName: 'Title',
          name: 'appointmentTitle',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          required: true,
          description: 'Título do agendamento',
        },
        {
          displayName: 'Description',
          name: 'appointmentDescription',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          description: 'Descrição do agendamento',
        },
        {
          displayName: 'Start Time',
          name: 'startTime',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          required: true,
          description: 'Horário de início (ISO 8601: 2024-01-15T14:00:00Z)',
        },
        {
          displayName: 'End Time',
          name: 'endTime',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          required: true,
          description: 'Horário de fim (ISO 8601: 2024-01-15T15:00:00Z)',
        },
        {
          displayName: 'Client ID',
          name: 'clientId',
          type: 'number',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          description: 'ID do cliente',
        },
        {
          displayName: 'Appointment Consultation Price',
          name: 'appointmentConsultationPrice',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          description: 'Preço da consulta (ex: "150.00")',
        },
        {
          displayName: 'Appointment Status',
          name: 'appointmentStatus',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          options: [
            { name: 'Agendado', value: 'agendado' },
            { name: 'Concluído', value: 'concluido' },
            { name: 'Cancelado', value: 'cancelado' },
          ],
          default: 'agendado',
          description: 'Status do agendamento',
        },
        {
          displayName: 'Is Paid',
          name: 'isPaid',
          type: 'boolean',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: false,
          description: 'Se o agendamento foi pago',
        },
        {
          displayName: 'Payment Method',
          name: 'paymentMethod',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          options: [
            { name: 'Cartão', value: 'cartao' },
            { name: 'PIX', value: 'pix' },
            { name: 'Dinheiro', value: 'dinheiro' },
            { name: 'Transferência', value: 'transferencia' },
          ],
          default: 'cartao',
          description: 'Método de pagamento',
        },
        {
          displayName: 'Payment Date',
          name: 'paymentDate',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createAppointment', 'updateAppointment'],
            },
          },
          default: '',
          description: 'Data do pagamento (ISO 8601: 2024-02-15T11:00:00Z)',
        },

        // Parâmetros para finanças
        {
          displayName: 'Financial Type Filter',
          name: 'financialType',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['getAllFinancial'],
            },
          },
          options: [
            { name: 'Todas', value: '' },
            { name: 'A Receber', value: 'receivable' },
            { name: 'A Pagar', value: 'payable' },
          ],
          default: '',
          description: 'Filtrar por tipo de conta',
        },

        // Campos para criação de conta financeira
        {
          displayName: 'Financial Account Type',
          name: 'financialAccountType',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          options: [
            { name: 'A Receber', value: 'receivable' },
            { name: 'A Pagar', value: 'payable' },
          ],
          default: 'receivable',
          required: true,
          description: 'Tipo da conta financeira',
        },
        {
          displayName: 'Financial Description',
          name: 'financialDescription',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          required: true,
          description: 'Descrição da conta financeira',
        },
        {
          displayName: 'Amount',
          name: 'amount',
          type: 'number',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: 0,
          required: true,
          description: 'Valor da conta',
        },
        {
          displayName: 'Due Date',
          name: 'dueDate',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          required: true,
          description: 'Data de vencimento (YYYY-MM-DD)',
        },
        {
          displayName: 'Paid Date',
          name: 'paidDate',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          description: 'Data de pagamento (YYYY-MM-DD)',
        },
        {
          displayName: 'Financial Is Paid',
          name: 'financialIsPaid',
          type: 'boolean',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: false,
          description: 'Se a conta foi paga',
        },
        {
          displayName: 'Financial Payment Method',
          name: 'financialPaymentMethod',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          description: 'Método de pagamento',
        },
        {
          displayName: 'Category',
          name: 'category',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          description: 'Categoria da conta',
        },
        {
          displayName: 'Financial Client ID',
          name: 'financialClientId',
          type: 'number',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          description: 'ID do cliente relacionado',
        },
        {
          displayName: 'Financial Appointment ID',
          name: 'financialAppointmentId',
          type: 'number',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          description: 'ID do agendamento relacionado',
        },
        {
          displayName: 'Financial Notes',
          name: 'financialNotes',
          type: 'string',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: '',
          description: 'Observações da conta financeira',
        },
        {
          displayName: 'Recurring',
          name: 'recurring',
          type: 'boolean',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          default: false,
          description: 'Se é uma conta recorrente',
        },
        {
          displayName: 'Recurring Period',
          name: 'recurringPeriod',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
              recurring: [true],
            },
          },
          options: [
            { name: 'Mensal', value: 'monthly' },
            { name: 'Anual', value: 'yearly' },
            { name: 'Semanal', value: 'weekly' },
          ],
          default: 'monthly',
          description: 'Período de recorrência',
        },
        {
          displayName: 'Financial Status',
          name: 'financialStatus',
          type: 'options',
          displayOptions: {
            show: {
              operation: ['createFinancial'],
            },
          },
          options: [
            { name: 'Pendente', value: 'pending' },
            { name: 'Pago', value: 'paid' },
            { name: 'Vencido', value: 'overdue' },
          ],
          default: 'pending',
          description: 'Status da conta financeira',
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

        responseData = await handleOperations.call(this, operation, i, credentials);

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

async function handleOperations(this: IExecuteFunctions, operation: string, itemIndex: number, credentials: any) {
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

      // Operações de Clientes
      case 'getAllClients': {
        const userId = this.getNodeParameter('userId', itemIndex) as string;
        const search = this.getNodeParameter('search', itemIndex) as string;
        
        let url = `${baseUrl}/clients`;
        const queryParams: string[] = [];
        
        if (userId) queryParams.push(`userId=${encodeURIComponent(userId)}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }

        return await this.helpers.httpRequest({
          method: 'GET',
          url,
          headers,
          json: true,
        });
      }

      case 'createClient': {
        const userId = this.getNodeParameter('userId', itemIndex) as string;
        const clientData: any = {
          name: this.getNodeParameter('clientName', itemIndex),
        };

        if (userId) clientData.userId = userId;

        // Campos opcionais
        const email = this.getNodeParameter('clientEmail', itemIndex) as string;
        const phone = this.getNodeParameter('clientPhone', itemIndex) as string;
        const cpf = this.getNodeParameter('clientCpf', itemIndex) as string;
        const birthDate = this.getNodeParameter('birthDate', itemIndex) as string;
        const address = this.getNodeParameter('address', itemIndex) as string;
        const consultationPrice = this.getNodeParameter('consultationPrice', itemIndex) as number;
        const paymentStatus = this.getNodeParameter('paymentStatus', itemIndex) as string;
        const notes = this.getNodeParameter('clientNotes', itemIndex) as string;

        if (email) clientData.email = email;
        if (phone) clientData.phone = phone;
        if (cpf) clientData.cpf = cpf;
        if (birthDate) clientData.birthDate = birthDate;
        if (address) clientData.address = address;
        if (consultationPrice) clientData.consultationPrice = consultationPrice;
        if (paymentStatus) clientData.paymentStatus = paymentStatus;
        if (notes) clientData.notes = notes;

        return await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}/clients`,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: clientData,
          json: true,
        });
      }

      // Operações de Agendamentos
      case 'getAllAppointments': {
        const userId = this.getNodeParameter('userId', itemIndex) as string;
        const startDate = this.getNodeParameter('startDate', itemIndex) as string;
        const endDate = this.getNodeParameter('endDate', itemIndex) as string;
        
        let url = `${baseUrl}/appointments`;
        const queryParams: string[] = [];
        
        if (userId) queryParams.push(`userId=${encodeURIComponent(userId)}`);
        if (startDate) queryParams.push(`start=${encodeURIComponent(startDate)}`);
        if (endDate) queryParams.push(`end=${encodeURIComponent(endDate)}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }

        return await this.helpers.httpRequest({
          method: 'GET',
          url,
          headers,
          json: true,
        });
      }

      case 'createAppointment': {
        const userId = this.getNodeParameter('userId', itemIndex) as string;
        const appointmentData: any = {
          title: this.getNodeParameter('appointmentTitle', itemIndex),
          startTime: this.getNodeParameter('startTime', itemIndex),
          endTime: this.getNodeParameter('endTime', itemIndex),
        };

        if (userId) appointmentData.userId = userId;

        // Campos opcionais
        const description = this.getNodeParameter('appointmentDescription', itemIndex) as string;
        const clientId = this.getNodeParameter('clientId', itemIndex) as number;
        const consultationPrice = this.getNodeParameter('appointmentConsultationPrice', itemIndex) as string;
        const status = this.getNodeParameter('appointmentStatus', itemIndex) as string;
        const isPaid = this.getNodeParameter('isPaid', itemIndex) as boolean;
        const paymentMethod = this.getNodeParameter('paymentMethod', itemIndex) as string;
        const paymentDate = this.getNodeParameter('paymentDate', itemIndex) as string;

        if (description) appointmentData.description = description;
        if (clientId) appointmentData.clientId = clientId;
        if (consultationPrice) appointmentData.consultationPrice = consultationPrice;
        if (status) appointmentData.status = status;
        if (isPaid !== undefined) appointmentData.isPaid = isPaid;
        if (paymentMethod) appointmentData.paymentMethod = paymentMethod;
        if (paymentDate) appointmentData.paymentDate = paymentDate;

        return await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}/appointments`,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: appointmentData,
          json: true,
        });
      }

      case 'updateAppointment': {
        const appointmentId = this.getNodeParameter('appointmentId', itemIndex) as number;
        const updateData: any = {
          title: this.getNodeParameter('appointmentTitle', itemIndex),
          startTime: this.getNodeParameter('startTime', itemIndex),
          endTime: this.getNodeParameter('endTime', itemIndex),
        };

        // Campos opcionais
        const description = this.getNodeParameter('appointmentDescription', itemIndex) as string;
        const clientId = this.getNodeParameter('clientId', itemIndex) as number;
        const consultationPrice = this.getNodeParameter('appointmentConsultationPrice', itemIndex) as string;
        const status = this.getNodeParameter('appointmentStatus', itemIndex) as string;
        const isPaid = this.getNodeParameter('isPaid', itemIndex) as boolean;
        const paymentMethod = this.getNodeParameter('paymentMethod', itemIndex) as string;
        const paymentDate = this.getNodeParameter('paymentDate', itemIndex) as string;

        if (description) updateData.description = description;
        if (clientId) updateData.clientId = clientId;
        if (consultationPrice) updateData.consultationPrice = consultationPrice;
        if (status) updateData.status = status;
        if (isPaid !== undefined) updateData.isPaid = isPaid;
        if (paymentMethod) updateData.paymentMethod = paymentMethod;
        if (paymentDate) updateData.paymentDate = paymentDate;

        return await this.helpers.httpRequest({
          method: 'PUT',
          url: `${baseUrl}/appointments/${appointmentId}`,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: updateData,
          json: true,
        });
      }

      // Operações Financeiras
      case 'getAllFinancial': {
        const userId = this.getNodeParameter('userId', itemIndex) as string;
        const type = this.getNodeParameter('financialType', itemIndex) as string;
        
        let url = `${baseUrl}/financial`;
        const queryParams: string[] = [];
        
        if (userId) queryParams.push(`userId=${encodeURIComponent(userId)}`);
        if (type) queryParams.push(`type=${encodeURIComponent(type)}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }

        return await this.helpers.httpRequest({
          method: 'GET',
          url,
          headers,
          json: true,
        });
      }

      case 'createFinancial': {
        const userId = this.getNodeParameter('userId', itemIndex) as string;
        const financialData: any = {
          type: this.getNodeParameter('financialAccountType', itemIndex),
          description: this.getNodeParameter('financialDescription', itemIndex),
          amount: this.getNodeParameter('amount', itemIndex),
          dueDate: this.getNodeParameter('dueDate', itemIndex),
        };

        if (userId) financialData.userId = userId;

        // Campos opcionais
        const paidDate = this.getNodeParameter('paidDate', itemIndex) as string;
        const isPaid = this.getNodeParameter('financialIsPaid', itemIndex) as boolean;
        const paymentMethod = this.getNodeParameter('financialPaymentMethod', itemIndex) as string;
        const category = this.getNodeParameter('category', itemIndex) as string;
        const clientId = this.getNodeParameter('financialClientId', itemIndex) as number;
        const appointmentId = this.getNodeParameter('financialAppointmentId', itemIndex) as number;
        const notes = this.getNodeParameter('financialNotes', itemIndex) as string;
        const recurring = this.getNodeParameter('recurring', itemIndex) as boolean;
        const recurringPeriod = this.getNodeParameter('recurringPeriod', itemIndex) as string;
        const status = this.getNodeParameter('financialStatus', itemIndex) as string;

        if (paidDate) financialData.paidDate = paidDate;
        if (isPaid !== undefined) financialData.isPaid = isPaid;
        if (paymentMethod) financialData.paymentMethod = paymentMethod;
        if (category) financialData.category = category;
        if (clientId) financialData.clientId = clientId;
        if (appointmentId) financialData.appointmentId = appointmentId;
        if (notes) financialData.notes = notes;
        if (recurring !== undefined) financialData.recurring = recurring;
        if (recurringPeriod) financialData.recurringPeriod = recurringPeriod;
        if (status) financialData.status = status;

        return await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}/financial`,
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: financialData,
          json: true,
        });
      }

      default:
        throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
    }
} 