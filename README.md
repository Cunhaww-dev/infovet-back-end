# Infovet

Prontuário digital veterinário para uso individual. O sistema permite que médicos veterinários registrem e acessem o histórico clínico de seus pacientes de forma rápida e organizada.

## Visão geral

Diferente de sistemas hospitalares, o foco não é gestão de clínica — é o registro clínico em si. Cada veterinário possui seus dados completamente isolados dos demais (multi-tenant por `veterinario_id`), podendo cadastrar tutores, pacientes, atendimentos e histórico médico completo via SOAP.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js LTS |
| Framework | Express 5 |
| Linguagem | TypeScript (strict) |
| Banco | MySQL |
| ORM | Drizzle ORM |
| Validação | Zod |
| Autenticação | JWT + bcrypt |
| Linter/Formatter | Biome |
| Build | tsup |

## Configuração

**1. Instale as dependências**
```bash
npm install
```

**2. Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Preencha o `.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="mysql://usuario:senha@host:3306/infovet"
JWT_SECRET="sua-chave-secreta-com-no-minimo-32-caracteres"
JWT_EXPIRES_IN="7d"
```

**3. Gere e execute as migrations**
```bash
npm run db:generate
npm run db:migrate
```

**4. Suba o servidor**
```bash
npm run dev
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor em modo watch |
| `npm run build` | Compila para produção |
| `npm start` | Executa build de produção |
| `npm run db:generate` | Gera migration a partir do schema |
| `npm run db:migrate` | Executa migrations pendentes |
| `npm run lint` | Verifica o código com Biome |
| `npm run format` | Formata o código com Biome |

## Estrutura

```
src/
  config/
    env.ts               # Variáveis de ambiente validadas com Zod
  db/
    index.ts             # Conexão Drizzle
    schema/
      veterinarios.ts    # Tabela + tipos inferidos
      tutores.ts
      pacientes.ts
      atendimentos.ts
      ...
  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts
      auth.schema.ts
    tutores/
    pacientes/
    atendimentos/
  middlewares/
    authenticate.ts      # Validação JWT
  routes/
    health.ts
  types/
    express.d.ts         # Extensão do req.user
  server.ts
drizzle/                 # Migrations geradas (commitar no git)
drizzle.config.ts
```

## Modelo de dados

```
veterinarios
  └── tutores (1:N)
  └── pacientes (1:N)
        └── atendimentos (1:N)
              └── soap_atendimentos (1:1)
              └── medicacoes (1:N)
              └── anexos (1:N)
        └── vacinas (1:N)
        └── historico_status_paciente (1:N)
```

Todo registro possui `veterinario_id`. Nenhum veterinário acessa dados de outro — o isolamento é garantido pelo token JWT, que carrega o `veterinario_id` e é validado em cada requisição antes de qualquer query.

## Rotas

### Públicas

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Status da API |
| POST | `/auth/register` | Cadastro de veterinário |
| POST | `/auth/login` | Login |

### Protegidas (requer `Authorization: Bearer <token>`)

| Método | Rota | Descrição |
|---|---|---|
| POST | `/tutores` | Criar tutor |
| GET | `/tutores` | Listar tutores |
| GET | `/tutores/:id` | Buscar tutor |
| PUT | `/tutores/:id` | Editar tutor |
| POST | `/pacientes` | Criar paciente |
| GET | `/pacientes` | Listar pacientes |
| GET | `/pacientes/:id` | Buscar paciente |
| POST | `/atendimentos` | Criar atendimento |
| GET | `/pacientes/:id/atendimentos` | Histórico do paciente |

> Rotas marcadas como protegidas ainda não implementadas — listadas aqui como referência do roadmap.

## Roadmap

**MVP** — autenticação, tutor, paciente, atendimento + SOAP

**V1** — vacinas, medicações, anexos

**V2** — busca avançada, alertas de retorno e vacina vencida

**V3** — templates por espécie, inteligência clínica
