# @devanthonymax/n8n-nodes-gestorclientes

Complete n8n integration for **Agenda API** with full CRUD operations!

## Installation

Install the community node package in your n8n instance:

```
@devanthonymax/n8n-nodes-gestorclientes
```

## Features

### Complete CRUD Operations
- **Client Management**: Create, Read, Update, Delete clients
- **Appointment Management**: Create, Read, Update, Delete appointments
- **Financial Management**: Create, Read, Update, Delete financial accounts
- **API Key Authentication**: Secure access with Bearer token authentication
- **Error Handling**: Robust error handling with continue-on-fail support

### Available Operations

#### Clients
- **Create**: Add new clients with name, email, phone, and optional CPF
- **Get All**: Retrieve all clients
- **Get By ID**: Retrieve specific client by ID
- **Update**: Modify existing client information
- **Delete**: Remove clients from the system

#### Appointments
- **Create**: Schedule new appointments with title, dates, status, and priority
- **Get All**: Retrieve all appointments
- **Get By ID**: Retrieve specific appointment by ID
- **Update**: Modify existing appointment details
- **Delete**: Cancel/remove appointments

#### Financial Accounts
- **Create**: Add new financial accounts (receivable/payable) with amount, due date, and category
- **Get All**: Retrieve all financial accounts
- **Get By ID**: Retrieve specific financial account by ID
- **Update**: Modify existing financial account information
- **Delete**: Remove financial accounts
- **Get Summary**: Retrieve financial summary with totals and status breakdown
- **Get Overdue**: Retrieve accounts that are overdue

## Setup

1. Install the community package in your n8n instance
2. Create credentials for "Gestor Clientes Max API":
   - **API Key**: Your API key (format: gck_xxxxxxxxxxxx)
   - **Base URL**: Your API base URL
3. Add the node to your workflow and select your credentials
4. Choose resource (Client/Appointment/Financial) and operation (Create/Read/Update/Delete)

## API Integration

This node integrates with your Agenda API providing:
- RESTful API endpoints for clients, appointments, and financial accounts
- Bearer token authentication  
- JSON request/response format
- Full CRUD operations support
- Advanced financial reporting (summary, overdue accounts)

## License

MIT