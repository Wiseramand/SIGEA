# SIGEA — Arquitetura Técnica do Backend & Diretrizes de Integração

## 1. Visão Geral da API
A API do SIGEA é concebida como uma arquitetura modular baseada em **Fastify**, **TypeScript (Strict Mode)**, **Zod** e **Prisma ORM** sobre **PostgreSQL**.

- **Prefixo Oficial:** `/api/v1`
- **Porta Padrão:** `4000` (desenvolvimento)
- **Formato de Comunicação:** `application/json` UTF-8
- **Identificador de Correlação:** Todo o pedido gera ou propaga um `x-request-id` (UUIDv4) injetado nos headers de resposta e nos logs estruturados.

---

## 2. Princípios de Multi-Tenancy & Segurança Rigorosa

### 2.1 Resolução da Organização (Tenant)
- **Regra:** O `organizationId` **NUNCA** é aceite a partir do payload ou query string do frontend como garantia de autorização.
- **Mecanismo:** A identificação do escritório é sempre resolvida a partir da sessão/token criptográfico autenticado do utilizador verificado no backend.
- **Isolamento de Base de Dados:** Todas as consultas Prisma em tabelas tenant-aware devem incluir obrigatoriamente a cláusula `where: { organizationId }`.

### 2.2 Proteção Contra IDOR (Insecure Direct Object Reference)
Para aceder a qualquer recurso (processo, cliente, prazo, documento, fatura), a query de validação deve garantir simultaneamente:
```typescript
// Exemplo canónico de consulta segura
const legalCase = await prisma.legalCase.findFirst({
  where: {
    id: caseId,
    organizationId: authContext.organizationId // Garante isolamento estrito
  }
});

if (!legalCase) {
  throw new NotFoundError('Processo não encontrado'); // Evita enumeração
}
```

### 2.3 Princípio Super Admin
- **Platform Administration ≠ Legal Data Access:** O `SUPER_ADMIN` possui permissões sobre planos, subscrições, cotas de disco e contas de escritórios, mas **não possui permissão de leitura sobre os dados jurídicos confidenciais** dos processos judiciais dos clientes.

---

## 3. Padrão de Respostas e Tratamento Centralizado de Erros

### Respostas de Sucesso
```json
{
  "success": true,
  "data": { ... }
}
```

### Respostas de Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Falha de validação dos dados da requisição",
    "details": [
      {
        "field": "claimValueAoa",
        "message": "O valor da causa deve ser positivo"
      }
    ],
    "requestId": "c1a9382e-9d21-4d1a-8e2b-7c4f1a238491"
  }
}
```

### Ocultação de Stack Traces
Em ambiente de produção (`NODE_ENV=production`), nenhuma informação interna, connection string ou stack trace é devolvida ao cliente HTTP.

---

## 4. Endpoints de Infraestrutura (Health & Readiness)

- `GET /api/v1/health`
  - Retorna o estado do serviço (`status: "ok"`), versão, timestamp e uptime em segundos.
  - Não expõe segredos nem dados de infraestrutura.
- `GET /api/v1/ready`
  - Retorna `status: "ready"` ou `"not_ready"` e HTTP `200` ou `503`.
  - Verifica se a configuração foi carregada corretamente e a prontidão das dependências críticas.

---

## 5. Política de Base de Dados & Migrations (Prisma)
- **Não Destruição:** Nunca executar `prisma migrate reset`, `DROP` ou `TRUNCATE` contra bases de dados existentes.
- **Fluxo Versionado:** Todas as alterações de schema no `apps/api/prisma/schema.prisma` devem originar ficheiros `migration.sql` versionados, passíveis de revisão antes de aplicação em staging/produção.
