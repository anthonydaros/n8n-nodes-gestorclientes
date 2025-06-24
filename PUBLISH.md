# Como Publicar o Pacote n8n-nodes-gestorclientes no npm

Este guia explica como publicar o pacote como um community node do n8n no npm.

## Pré-requisitos

1. **Conta npm**: Você precisa ter uma conta no [npmjs.com](https://www.npmjs.com/)
2. **npm CLI autenticado**: Execute `npm login` no terminal
3. **Código testado**: Certifique-se de que tudo está funcionando

## Verificações Antes da Publicação

### 1. Validar o Build
```bash
pnpm run build
```

### 2. Executar Testes
```bash
pnpm run test
```

### 3. Verificar Linting
```bash
pnpm run lint
```

### 4. Verificar package.json
Confirme que o `package.json` contém:
- ✅ `"keywords": ["n8n-community-node-package", ...]`
- ✅ Seção `"n8n"` com paths corretos para os nodes
- ✅ Versão atualizada
- ✅ Informações de repositório

## Passos para Publicação

### 1. Atualizar a Versão
```bash
# Para correções de bugs (0.1.0 → 0.1.1)
npm version patch

# Para novas funcionalidades (0.1.0 → 0.2.0)
npm version minor

# Para mudanças que quebram compatibilidade (0.1.0 → 1.0.0)
npm version major
```

### 2. Verificar os Arquivos que Serão Publicados
```bash
npm pack --dry-run
```

Isso mostra quais arquivos serão incluídos no pacote. Verifique se:
- ✅ Pasta `dist/` está incluída
- ✅ `README.md` está incluído
- ✅ `package.json` está incluído
- ❌ Pasta `src/` NÃO deve estar incluída (apenas `dist/`)
- ❌ `node_modules/` NÃO deve estar incluída

### 3. Publicar no npm
```bash
# Para pacote público (primeira vez)
npm publish --access public

# Para atualizações subsequentes
npm publish
```

### 4. Verificar a Publicação
Acesse `https://www.npmjs.com/package/n8n-nodes-gestorclientes` para confirmar que:
- ✅ O pacote foi publicado
- ✅ A versão está correta
- ✅ A documentação aparece corretamente
- ✅ A keyword `n8n-community-node-package` está visível

## Após a Publicação

### 1. Testar a Instalação
Em uma instância nova do n8n:
```bash
# Instalar via npm
npm install n8n-nodes-gestorclientes

# Ou via pnpm
pnpm add n8n-nodes-gestorclientes
```

### 2. Verificar no n8n
1. Reinicie sua instância do n8n
2. Verifique se os nodes aparecem na lista de integrações
3. Teste as funcionalidades básicas

### 3. Criar uma Release no GitHub (Opcional)
Se você tem um repositório no GitHub:
1. Crie uma tag para a versão: `git tag v0.1.0`
2. Faça push da tag: `git push origin v0.1.0`
3. Crie uma release no GitHub com as mudanças

## Estrutura de Versionamento

Seguimos o [Semantic Versioning (SemVer)](https://semver.org/):

- **PATCH** (0.1.0 → 0.1.1): Correções de bugs
- **MINOR** (0.1.0 → 0.2.0): Novas funcionalidades (compatível)
- **MAJOR** (0.1.0 → 1.0.0): Mudanças que quebram compatibilidade

## Solução de Problemas

### Erro: "Package name too similar to existing package"
- Considere adicionar um escopo: `@seu-usuario/n8n-nodes-agenda`

### Erro: "You do not have permission to publish"
- Verifique se está logado: `npm whoami`
- Execute `npm login` novamente

### Erro: "Version already exists"
- Atualize a versão com `npm version patch/minor/major`

### Node não aparece no n8n
- Verifique se a keyword `n8n-community-node-package` está no package.json
- Confirme que os paths na seção `n8n` estão corretos
- Reinicie completamente a instância do n8n

## Comandos Úteis

```bash
# Ver informações do pacote
npm info n8n-nodes-gestorclientes

# Ver quem pode publicar
npm owner ls n8n-nodes-gestorclientes

# Despublicar (só funciona nas primeiras 24h)
npm unpublish n8n-nodes-gestorclientes@0.1.0

# Ver versões publicadas
npm view n8n-nodes-gestorclientes versions --json
```

## Checklist Final

Antes de publicar, confirme:

- [ ] Código testado e funcionando
- [ ] Build executado com sucesso (`pnpm run build`)
- [ ] Testes passando (`pnpm run test`)
- [ ] Linting sem erros (`pnpm run lint`)
- [ ] Versão atualizada no package.json
- [ ] README.md atualizado com instruções de uso
- [ ] Seção `n8n` do package.json com paths corretos
- [ ] Keywords incluem `n8n-community-node-package`
- [ ] Logged no npm (`npm whoami`)

✅ **Pronto para publicar!**

---

*Este guia foi criado para o pacote n8n-nodes-gestorclientes* 