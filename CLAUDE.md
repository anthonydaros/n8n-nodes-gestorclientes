# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package that provides integration with an Agenda API for client and appointment management. The package creates a custom node called "Gestor Clientes Max" that can be installed in n8n workflows.

## Architecture

- **Package Entry Point**: `index.js` - Module export defining nodes and credentials arrays
- **Main Node**: `nodes/GestorClientesMax/GestorClientesMax.node.js` - Single n8n node class implementation
- **Credentials**: `credentials/GestorClientesMaxApi.credentials.js` - API key authentication
- **Node Icon**: `nodes/GestorClientesMax/gestorclientes.svg` - Custom SVG icon for the node
- **Package Configuration**: Standard npm package with n8n-specific configuration in package.json

## Node Structure

The `GestorClientesMax` class follows n8n's node pattern:
- **Resources**: `client` and `appointment`
- **Operations**: Full CRUD for both resources
  - Client: `getAll`, `get`, `create`, `update`, `delete`
  - Appointment: `getAll`, `get`, `create`, `update`, `delete`
- **API Integration**: Makes authenticated HTTP requests to https://agenda.anthonymax.com/api
- **Authentication**: Uses Bearer token authentication with API keys
- **Data Validation**: Comprehensive field validation with required and optional parameters

## Common Commands

```bash
# Check package structure before publishing
npm run publish:check

# Install package locally for testing
npm pack

# Test API endpoints (requires valid API key)
node test-api.js
```

## Development Notes

- Node requires n8n-workflow as peer dependency
- Uses n8n's helper methods for HTTP requests (`this.helpers.httpRequest`)
- Follows n8n node conventions with displayOptions for conditional UI fields
- Error handling includes continueOnFail support and NodeOperationError
- API key authentication required for all endpoints
- All text and descriptions are in Portuguese
- Test API key format: `gck_...` (Global Client Key)

## API Endpoints Tested

### Clients (Fully Working)
- `GET /clients` - Retrieve all clients (✅ Working)
- `GET /clients/{id}` - Retrieve client by ID (✅ Working)
- `POST /clients` - Create new client (✅ Working)
- `PUT /clients/{id}` - Update client (✅ Working)
- `DELETE /clients/{id}` - Delete client (✅ Working)

### Appointments (Fully Working)
- `GET /appointments` - Retrieve all appointments (✅ Working)
- `GET /appointments/{id}` - Retrieve appointment by ID (✅ Working)
- `POST /appointments` - Create new appointment (✅ Working)
- `PUT /appointments/{id}` - Update appointment (✅ Working)
- `DELETE /appointments/{id}` - Delete appointment (✅ Working)

### Financial Accounts (Fully Working)
- `GET /financial-accounts` - Retrieve all financial accounts (✅ Working)
- `GET /financial-accounts/{id}` - Retrieve financial account by ID (✅ Working)
- `POST /financial-accounts` - Create new financial account (✅ Working)
- `PUT /financial-accounts/{id}` - Update financial account (✅ Working)
- `DELETE /financial-accounts/{id}` - Delete financial account (✅ Working)
- `GET /financial-accounts/summary` - Get financial summary (✅ Working)
- `GET /financial-accounts/overdue` - Get overdue accounts (✅ Working)

*Note: Financial amounts must be provided as strings (e.g., "150.00"), dates as ISO format for create/update operations*