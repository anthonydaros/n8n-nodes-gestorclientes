"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = exports.nodes = void 0;
const GestorClientesMax_node_1 = require("./nodes/GestorClientesMax/GestorClientesMax.node");
const GestorClientesMaxCliente_node_1 = require("./nodes/GestorClientesMax/GestorClientesMaxCliente.node");
const GestorClientesMaxAgendamento_node_1 = require("./nodes/GestorClientesMax/GestorClientesMaxAgendamento.node");
const GestorClientesMaxFinancas_node_1 = require("./nodes/GestorClientesMax/GestorClientesMaxFinancas.node");
const GestorClientesMaxUsers_node_1 = require("./nodes/GestorClientesMax/GestorClientesMaxUsers.node");
const GestorClientesMaxApi_credentials_1 = require("./credentials/GestorClientesMaxApi.credentials");
exports.nodes = [
    new GestorClientesMax_node_1.GestorClientesMax(),
    new GestorClientesMaxCliente_node_1.GestorClientesMaxCliente(),
    new GestorClientesMaxAgendamento_node_1.GestorClientesMaxAgendamento(),
    new GestorClientesMaxFinancas_node_1.GestorClientesMaxFinancas(),
    new GestorClientesMaxUsers_node_1.GestorClientesMaxUsers(),
];
exports.credentials = [
    new GestorClientesMaxApi_credentials_1.GestorClientesMaxApi(),
];
//# sourceMappingURL=index.js.map