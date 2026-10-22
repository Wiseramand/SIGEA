# SIGEA — Sistema Integrado de Gestão de Escritórios de Advocacia em Angola

O **SIGEA** é uma plataforma SaaS profissional, multi-tenant e escalável concebida especificamente para o ecossistema jurídico angolano, respeitando rigorosamente as normas da Ordem dos Advogados de Angola (OAA), o Código de Processo Civil e a legislação tributária em vigor.

---

## 🏛️ Estrutura do Monorepo

```text
sigea/
│
├── apps/
│   ├── web/               # Frontend SPA (React + TypeScript + Vite + Tailwind CSS)
│   └── api/               # Backend API (Node.js + Fastify + Prisma ORM)
│
├── packages/
│   ├── shared/            # Contratos partilhados (Enums, Types, Formatadores AOA/Kz)
│   ├── ui/                # Componentes e Design System
│   └── config/            # Configurações TypeScript e linting
│
├── docs/                  # Documentação de arquitetura e requisitos
├── pnpm-workspace.yaml    # Definição de pacotes do monorepo
└── package.json           # Scripts de orquestração do monorepo
```

---

## 🚀 Tecnologias Centrais

- **Linguagem:** TypeScript (strict mode em todo o repositório)
- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide Icons
- **Gestão de Pacotes:** `pnpm` workspaces
- **Padrão de Cores:** Enterprise Legal Tech (Grafite, Azul Nobre Jurídico, Ouro Acetinado OAA)
- **Moeda e Formatação:** Kwanzas (`AOA` / `Kz`), NIF Angolano, Tribunais de Angola

---

## ⚡ Como Executar Localmente

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Compilar Pacotes Partilhados
```bash
pnpm build
```

### 3. Iniciar Servidor de Desenvolvimento
```bash
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 🔒 Princípios de Segurança e Multi-Tenancy

- **Isolamento Estrito:** Toda a entidade e consulta é vinculada a um `organizationId`.
- **RBAC Seguro:** Controlo de acessos baseado em perfis (Sócio, Advogado, Estagiário, Financeiro, Secretária, Cliente, Super Admin).
- **Platform Administration ≠ Legal Data Access:** O Super Admin SaaS administra planos e infraestrutura sem visualizar o conteúdo confidencial dos processos dos escritórios clientes.
