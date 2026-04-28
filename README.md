# Infovet

Prontuário digital veterinário para uso individual. O sistema permite que médicos veterinários registrem e acessem o histórico clínico de seus pacientes de forma rápida e organizada.

## Visão geral

Diferente de sistemas hospitalares, o foco não é gestão de clínica — é o registro clínico em si. Cada veterinário possui seus dados completamente isolados dos demais (multi-tenant por `veterinarian_id`), podendo cadastrar tutores, pacientes, atendimentos e histórico médico completo via SOAP.

## Stack

| Camada           | Tecnologia          |
| ---------------- | ------------------- |
| Runtime          | Node.js LTS         |
| Framework        | Express 5           |
| Linguagem        | TypeScript (strict) |
| Banco            | MySQL               |
| ORM              | Drizzle ORM         |
| Validação        | Zod                 |
| Autenticação     | JWT + bcrypt        |
| Linter/Formatter | Biome               |
| Build            | tsup                |

## Configuração

**1. Instale as dependências**

```bash
npm install
```

**2. Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Preencha o `.env`. Para gerar um `JWT_SECRET` seguro:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
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

| Script                | Descrição                         |
| --------------------- | --------------------------------- |
| `npm run dev`         | Servidor em modo watch            |
| `npm run build`       | Compila para `dist/server.js`     |
| `npm start`           | Executa build de produção         |
| `npm run db:generate` | Gera migration a partir do schema |
| `npm run db:migrate`  | Executa migrations pendentes      |
| `npm run db:studio`   | Abre o Drizzle Studio             |
| `npm run lint`        | Verifica o código com Biome       |
| `npm run format`      | Formata o código com Biome        |

## Estrutura

```
src/
  config/
    env.ts               # Variáveis de ambiente validadas com Zod
  db/
    index.ts             # Conexão Drizzle
    schema/
      veterinarian.ts    # Tabela + tipos inferidos
      owners.ts          # (futuro)
      patients.ts        # (futuro)
      appointments.ts    # (futuro)
  modules/
    auth/
      auth.routes.ts
      auth.controller.ts
      auth.service.ts
      auth.schema.ts
    owners/              # (futuro)
    patients/            # (futuro)
    appointments/        # (futuro)
  middlewares/
    authentication.ts    # Validação JWT + declaração de req.user
  routes/
    health.ts
  server.ts
drizzle/                 # Migrations geradas (commitar no git)
drizzle.config.ts
```

## Modelo de dados

```
veterinarians
  └── owners (1:N)
  └── patients (1:N)
        └── appointments (1:N)
              └── soap (1:1)
              └── medications (1:N)
              └── attachments (1:N)
        └── vaccines (1:N)
```

Todo registro possui `veterinarian_id`. Nenhum veterinário acessa dados de outro — o isolamento é garantido pelo token JWT, que carrega o `veterinarian_id` e é validado em cada requisição antes de qualquer query.

## Rotas

### Públicas

| Método | Rota             | Descrição               |
| ------ | ---------------- | ----------------------- |
| GET    | `/health`        | Status da API           |
| POST   | `/auth/register` | Cadastro de veterinário |
| POST   | `/auth/login`    | Login                   |

### Protegidas (requer `Authorization: Bearer <token>`)

| Método | Rota                            | Descrição             |
| ------ | ------------------------------- | --------------------- |
| POST   | `/owners`                       | Criar tutor           |
| GET    | `/owners`                       | Listar tutores        |
| GET    | `/owners/:id`                   | Buscar tutor          |
| PUT    | `/owners/:id`                   | Editar tutor          |
| POST   | `/patients`                     | Criar paciente        |
| GET    | `/patients`                     | Listar pacientes      |
| GET    | `/patients/:id`                 | Buscar paciente       |
| POST   | `/appointments`                 | Criar atendimento     |
| GET    | `/patients/:id/appointments`    | Histórico do paciente |

> Rotas protegidas ainda não implementadas — listadas aqui como referência do roadmap.

## Roadmap

**MVP** — autenticação, tutor, paciente, atendimento + SOAP

**V1** — vacinas, medicações, anexos

**V2** — busca avançada, alertas de retorno e vacina vencida

**V3** — templates por espécie, inteligência clínica
