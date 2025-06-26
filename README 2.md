# n8n - Base de Desenvolvimento de Nodes e Workflows

Este repositório serve como codebase para a criação de nodes, MCPs (Master Control Programs) e workflows customizados para a plataforma n8n.

## Visão Geral

O objetivo é centralizar o desenvolvimento de integrações personalizadas, seguindo as melhores práticas e padrões do n8n.

## Pré-requisitos

Antes de começar, garanta que você tenha o seguinte ambiente configurado:

- **Node.js**: Versão 18.x ou superior.
- **pnpm**: Gerenciador de pacotes.
- **Git**: Para controle de versão.
- **n8n**: Uma instância do n8n rodando localmente para testes. Você pode usar o Docker ou `npx n8n`.
- **TypeScript**: Conhecimento básico é recomendado.

## 🚀 Começando

Para iniciar o desenvolvimento, o primeiro passo é utilizar o template oficial do n8n para a criação de nodes.

1.  **Clone o Repositório Starter:**
    ```bash
    git clone https://github.com/n8n-io/n8n-nodes-starter.git n8n-custom-nodes
    cd n8n-custom-nodes
    ```

2.  **Instale as Dependências:**
    Use `pnpm` para instalar os pacotes necessários.
    ```bash
    pnpm install
    ```

## 🛠️ Fluxo de Desenvolvimento

Para testar seu node customizado em tempo real, você precisa linkar seu projeto local com a sua instância do n8n.

1.  **Linkando o Pacote Local:**
    Dentro da pasta do seu projeto (`n8n-custom-nodes`), crie um link simbólico.
    ```bash
    pnpm link --global
    ```

2.  **Conectando com o n8n:**
    Navegue até o diretório onde o n8n está instalado globalmente (ou onde você o executa) e linke o pacote.
    ```bash
    # Exemplo de como fazer com n8n instalado via npm/pnpm
    # Encontre o diretório global do pnpm
    PNPM_GLOBAL_DIR=$(pnpm root -g)
    cd $PNPM_GLOBAL_DIR/n8n
    pnpm link --global n8n-nodes-starter
    ```
    Se você usa a versão Desktop ou Docker, consulte a documentação sobre como carregar nodes customizados.

3.  **Iniciando o n8n:**
    Inicie o n8n. Seu node customizado deverá aparecer na lista de integrações.
    ```bash
    n8n start
    ```

## 📂 Estrutura de Arquivos de um Node

A estrutura principal para um novo node reside no diretório `nodes/`.

```
/nodes
  /MyNode
    MyNode.node.ts       # Lógica principal, propriedades e método execute()
    MyNode.node.json     # Metadados do node (opcional)
/credentials
  MyCredentials.credentials.ts # Definição das credenciais (se necessário)
```

-   **`MyNode.node.ts`**: É o coração do seu node. Aqui você define as propriedades (inputs, outputs), a descrição e a função `execute` que contém a lógica a ser executada.
-   **`MyCredentials.credentials.ts`**: Se o seu node precisa se autenticar em uma API, este arquivo define os campos necessários para as credenciais (ex: API Key, OAuth2).

##🧪 Testando

-   **Linting**: Verifique a qualidade do código com o linter fornecido.
    ```bash
    pnpm run lint
    ```
-   **Build**: Compile os arquivos TypeScript para JavaScript.
    ```bash
    pnpm run build
    ```
-   **Teste Funcional**: Crie um workflow na sua instância local do n8n, adicione seu node, configure os parâmetros e execute para validar o comportamento.

## 📦 Pacote npm Publicável

Este projeto está configurado como um **community node package** para o n8n, pronto para ser publicado no npm.

### Nodes Incluídos

#### 1. ExampleNode
-   **Arquivo**: `src/nodes/ExampleNode/ExampleNode.node.ts`
-   **Descrição**: Node de exemplo para demonstrar estrutura e boas práticas
-   **Funcionalidades**: Transformação de texto, contagem de itens

#### 2. AgendaApiSimple
-   **Arquivo**: `src/nodes/AgendaApi/AgendaApiSimple.node.ts`
-   **Descrição**: Integração com a API de Agenda (agenda.anthonymax.com)
-   **Funcionalidades**: Gerenciamento de clientes e agendamentos

### Como Publicar no npm

Consulte o arquivo [`PUBLISH.md`](./PUBLISH.md) para instruções completas sobre como publicar este pacote no npm como um community node do n8n.

## 📋 Workflows Inclusos

Este repositório também conta com workflows MCP prontos para uso:

### MCP Agenda API
-   **Arquivo**: `workflows/agenda-api-mcp-workflow.json`
-   **Documentação**: `docs/agenda-api-documentation.md`
-   **Descrição**: Workflow MCP completo para integração com a API de Agenda (agenda.anthonymax.com)
-   **Funcionalidades**:
    -   Autenticação (login/logout)
    -   CRUD completo de clientes
    -   Gerenciamento de agendamentos
    -   Suporte a todos os endpoints da API

### Como Importar um Workflow

1.  Acesse sua instância do n8n
2.  Clique em "Import" no canto superior direito
3.  Selecione o arquivo `.json` do workflow desejado
4.  Configure as credenciais necessárias
5.  Ative o workflow

## 📚 Links Úteis

-   [Documentação Oficial: Criando Nodes](https://docs.n8n.io/integrations/creating-nodes/overview/)
-   [Repositório n8n-nodes-starter](https://github.com/n8n-io/n8n-nodes-starter)
-   [Instalando Nodes Privados](https://docs.n8n.io/integrations/creating-nodes/deploy/install-private-nodes/)
-   [Tópico da Comunidade sobre Build de Nodes](https://community.n8n.io/t/building-custom-nodes/58148)

---
*Este documento foi gerado e será mantido pela IA assistente.* 

gck_25013b7c39016ec332a5f55dcd96bfe308cee7da5421f64ef908cf1fb5792911