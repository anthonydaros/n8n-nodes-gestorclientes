/**
 * Main entry point for n8n custom nodes
 */

// Export nodes
export { ExampleNode } from './nodes/ExampleNode/ExampleNode.node';
export { AgendaApiSimple } from './nodes/AgendaApi/AgendaApiSimple.node';

// Export credentials (add when created)
// export { ExampleCredentials } from './credentials/ExampleCredentials.credentials';

// Export utilities (add when created)
// export * from './utils';

// Package information
export const packageInformation = {
  name: '@devanthonymax/n8n-nodes-gestorclientes',
  version: '0.1.0',
  description: 'N8n community nodes collection - agenda API integration and utilities',
}; 