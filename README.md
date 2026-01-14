# IPqM SAASS Management System

Sistema de gestão de SAASS, componentes e lançamentos desenvolvido com Next.js, TypeScript, TailwindCSS e Supabase.

## Funcionalidades

- **Dashboard** com cards de resumo (lançamento atual, dias desde última entrega, etc.)
- **CRUD completo** para todas as entidades:
  - Eletrônicas
  - Hidrofones
  - Packs de Baterias
  - Tubos
  - SAASS (sistemas completos)
  - Lançamentos
  - Entregas e Retornos
- **Página de lançamentos** com previsões de entregas (60 dias entre entregas)
- **Layout responsivo** com sidebar e topbar
- **Integração com Supabase** (PostgreSQL) usando UTC timezone

## Tecnologias

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, Lucide React Icons
- **Backend**: Supabase (PostgreSQL)
- **Deploy**: Vercel (configurado com `vercel.json`)

## Configuração do Banco de Dados

### 1. Executar o script SQL

Acesse o painel do Supabase (https://supabase.com) e vá para a aba **SQL Editor**.

Copie e execute o conteúdo do arquivo `supabase_schema.sql` para criar todas as tabelas, chaves, índices e constraints.

### 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uhhphrrfxulrbqbbzdik.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_qXR2_k6KGSq7TQivTdbU7Q_BGiSdFRs
```

**Nota**: A API key fornecida é uma publishable key. Para operações sensíveis, considere usar a service role key em server actions.

### 3. Estrutura do Banco

O banco segue convenções:
- Tabelas no plural, snake_case (ex: `eletronicas`, `saass`)
- Colunas em snake_case
- Chaves primárias usando `text` para números de série
- Timestamps com timezone UTC
- Índices para performance em joins

## Execução Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev
```

Acesse http://localhost:3000

## Deploy no Vercel

O projeto está configurado para deploy automático no Vercel através do arquivo `vercel.json`.

1. Conecte seu repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. O deploy será automático a cada push para a branch `master`

## Regras de Negócio Implementadas

### Dashboard
- **Lançamento atual**: Maior `numero_lancamento` na tabela `lancamentos`
- **Dias desde última entrega**: Calculado a partir da maior `data_hora_entrega` em `entregas_lancamentos`
- **Dias desde último SAASS**: Calculado a partir da maior `data_fabricacao` em `saass`

### Previsões de Entrega
- Baseadas na última entrega registrada
- Intervalo fixo de 60 dias entre entregas
- Horizonte de 1 ano
- Implementado em `/lancamentos`

## Estrutura de Pastas

```
app/
├── layout.tsx           # Layout principal
├── page.tsx            # Dashboard
├── lancamentos/
│   └── page.tsx        # Página de lançamentos
components/
├── layout/             # Sidebar, Topbar
├── dashboard/          # Cards, QuickLinks, RecentActivity
├── lancamentos/        # LaunchTable, DeliveryForecast
lib/
└── supabaseClient.ts   # Cliente Supabase
```

## Próximos Passos

1. Implementar server actions para CRUDs
2. Adicionar autenticação com Supabase Auth
3. Implementar validações de formulário
4. Adicionar testes unitários e de integração
5. Implementar exportação de dados (CSV, Excel)

## Licença

Uso interno do IPqM.
