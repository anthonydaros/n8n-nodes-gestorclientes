# Publicação no npm - @devanthonymax

## Configuração da Organização npm

### 1. Verificar Login no npm
```bash
npm whoami
```

### 2. Login na Organização devanthonymax
```bash
npm login
# Use suas credenciais da organização devanthonymax
```

### 3. Verificar Acesso à Organização
```bash
npm access ls-packages @devanthonymax
```

## Comandos de Publicação

### Pré-requisitos
```bash
# Verificar se tudo está OK
pnpm run verify

# Verificar o que será publicado
npm pack --dry-run
```

### Publicação Inicial
```bash
# Build do projeto
pnpm run build

# Publicação no npm
npm publish --access=public
```

### Para Atualizações Futuras
```bash
# Incrementar versão (patch, minor, major)
npm version patch

# Ou manualmente no package.json e depois:
pnpm run build
npm publish
```

## Verificação Pós-Publicação

### Testar Instalação
```bash
# Em outro diretório, testar:
npm install @devanthonymax/n8n-nodes-gestorclientes
```

### Verificar no Registry
- Acesse: https://www.npmjs.com/package/@devanthonymax/n8n-nodes-gestorclientes
- Confirme que a documentação aparece corretamente

## Estrutura Final do Projeto

```
📦 @devanthonymax/n8n-nodes-gestorclientes
├── 📂 GitHub: https://github.com/anthonydaros/n8n-nodes-gestorclientes
├── 📂 npm: https://npmjs.com/package/@devanthonymax/n8n-nodes-gestorclientes
├── 🔧 2 nodes prontos (ExampleNode + AgendaApiSimple)
├── ✅ Testes passando (9/9)
├── 📚 Documentação completa
└── 🚀 Workflows MCP incluídos
```

## Comandos Resumidos

```bash
# 1. Verificar tudo
pnpm run verify

# 2. Build final
pnpm run build

# 3. Login no npm (se necessário)
npm login

# 4. Publicar
npm publish --access=public

# 5. Verificar
npm view @devanthonymax/n8n-nodes-gestorclientes
```

---

**Pronto para publicação!** 🚀

O pacote seguirá o padrão de nomes como `@devlikeapro/n8n-nodes-chatwoot` que você mencionou. 