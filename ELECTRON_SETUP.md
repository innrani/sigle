# SIGLE - Sistema de Gestão para TVs e Projetores
## Configuração e Execução com Electron

### 📋 Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn

### 🚀 Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Rebuild do better-sqlite3 para Electron:**
```bash
npm run electron:rebuild
```
ou
```bash
npx electron-rebuild -f -w better-sqlite3
```

### 🔧 Executar em Modo Desenvolvimento

**Opção 1: Desenvolvimento com Electron**
```bash
npm run electron:dev
```
Este comando irá:
- Iniciar o servidor Vite (React) na porta 3000
- Abrir a aplicação Electron automaticamente
- Hot reload habilitado

**Opção 2: Desenvolvimento apenas com Vite (navegador)**
```bash
npm run dev
```

### 📦 Build para Produção

**Build do Electron:**
```bash
npm run electron:build
```

Isso irá:
- Compilar o projeto React com Vite
- Criar o executável do Electron na pasta `dist_electron`

**Apenas build do frontend:**
```bash
npm run build
```

### 🗄️ Banco de Dados

O sistema usa SQLite através do `better-sqlite3`. O arquivo do banco de dados será criado automaticamente em:

**Windows:**
```
C:\Users\<SeuUsuário>\AppData\Roaming\sigle\database.db
```

**Linux:**
```
~/.config/sigle/database.db
```

**macOS:**
```
~/Library/Application Support/sigle/database.db
```

### 📊 Estrutura do Banco de Dados

O banco de dados inclui as seguintes tabelas:

- **clients** - Instituições/escolas clientes
- **equipment** - TVs e projetores
- **parts** - Peças para manutenção (lâmpadas, cabos, etc.)
- **technicians** - Técnicos responsáveis

### 🔌 API IPC (Electron)

A comunicação entre o frontend React e o backend Electron é feita via IPC:

#### Clientes
- `list-clients` - Lista clientes ativos
- `list-all-clients` - Lista todos os clientes
- `add-client` - Adiciona novo cliente
- `update-client` - Atualiza cliente
- `delete-client` - Inativa/deleta cliente
- `reactivate-client` - Reativa cliente
- `get-client` - Busca cliente por ID

#### Equipamentos
- `add-equipment` - Adiciona equipamento
- `list-active-equipments` - Lista equipamentos ativos
- `list-all-equipments` - Lista todos os equipamentos
- `update-equipment` - Atualiza equipamento
- `delete-equipment` - Inativa/deleta equipamento
- `reactivate-equipment` - Reativa equipamento

#### Peças
- `create-part` - Cria nova peça
- `list-parts` - Lista peças ativas
- `update-part` - Atualiza peça
- `delete-part` - Inativa peça

#### Técnicos
- `create-technician` - Cria novo técnico
- `list-technicians` - Lista técnicos ativos
- `update-technician` - Atualiza técnico
- `delete-technician` - Inativa técnico

### 🛠️ Solução de Problemas

**Erro ao iniciar o Electron:**
- Certifique-se de ter executado `npm install`
- Rode `npx electron-rebuild -f -w better-sqlite3`

**Banco de dados não encontrado:**
- O banco é criado automaticamente na primeira execução
- Verifique os logs no console para o caminho do arquivo

**Hot reload não funciona:**
- Reinicie o processo `npm run electron:dev`
- Verifique se a porta 3000 está livre

### 📝 Modo Fallback (LocalStorage)

Se o Electron não estiver disponível, o sistema automaticamente usa localStorage como fallback para desenvolvimento no navegador.

### 🎯 Funcionalidades Principais

- ✅ Gestão de clientes (instituições de ensino)
- ✅ Cadastro de equipamentos (TVs e projetores)
- ✅ Controle de estoque de peças
- ✅ Gerenciamento de técnicos
- ✅ Busca em tempo real
- ✅ Visualização detalhada de registros
- ✅ Edição inline
- ✅ Soft delete (preserva histórico)

### 📧 Suporte

Para questões técnicas ou bugs, consulte a documentação ou abra uma issue no repositório.
