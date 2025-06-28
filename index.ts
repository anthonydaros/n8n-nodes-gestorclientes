import type { ICredentialType, INodeType } from 'n8n-workflow';

import { GestorClientesMax } from './nodes/GestorClientesMax/GestorClientesMax.node';
import { GestorClientesMaxCliente } from './nodes/GestorClientesMax/GestorClientesMaxCliente.node';
import { GestorClientesMaxAgendamento } from './nodes/GestorClientesMax/GestorClientesMaxAgendamento.node';
import { GestorClientesMaxFinancas } from './nodes/GestorClientesMax/GestorClientesMaxFinancas.node';
import { GestorClientesMaxUsers } from './nodes/GestorClientesMax/GestorClientesMaxUsers.node';
import { GestorClientesMaxApi } from './credentials/GestorClientesMaxApi.credentials';

export const nodes: INodeType[] = [
  new GestorClientesMax(),
  new GestorClientesMaxCliente(),
  new GestorClientesMaxAgendamento(),
  new GestorClientesMaxFinancas(),
  new GestorClientesMaxUsers(),
];

export const credentials: ICredentialType[] = [
  new GestorClientesMaxApi(),
]; 