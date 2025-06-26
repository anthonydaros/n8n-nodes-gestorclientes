class GestorClientesMaxApi {
  constructor() {
    this.name = 'gestorClientesMaxApi';
    this.displayName = 'Gestor Clientes Max API';
    this.documentationUrl = 'https://agenda.anthonymax.com/api/docs/';
    this.properties = [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        required: true,
        description: 'The API key for Gestor Clientes Max API',
      },
      {
        displayName: 'Base URL',
        name: 'baseUrl',
        type: 'string',
        default: 'https://agenda.anthonymax.com/api',
        required: true,
        description: 'Base URL for the API',
      },
    ];
  }
}

module.exports = { GestorClientesMaxApi };