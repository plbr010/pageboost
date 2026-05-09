# PageBoost (MVP simples)

**Página pública de captura** (`/l/[slug]`) + **salvar lead no Supabase** + **abrir WhatsApp com mensagem pronta** + **Kanban manual** no painel. Sem ERP, sem API oficial do WhatsApp, sem leitura de mensagens.

## Supabase (instalação)

1. Crie um projeto em [Supabase](https://supabase.com).
2. Em **SQL Editor**, execute o arquivo `supabase/migrations/20260504000000_mvp.sql` (projeto novo).
3. **Authentication → Email** habilitado. Para testar rápido, pode desativar confirmação de e-mail.
4. Copie **URL** e **anon key** para `.env.local` (veja `.env.local.example`).

> Se você já tinha rodado uma versão antiga deste repositório (com ERP / token de ingestão), o ideal é **criar um projeto Supabase novo** e rodar só o SQL atual — evita conflito de schema.

## Variáveis de ambiente

Copie `.env.local.example` para `.env.local` (ou edite o `.env.local` já criado).

- `NEXT_PUBLIC_SUPABASE_URL` — **Project URL**
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — chave **Publishable** (`sb_publishable_...`) **ou**, se o painel ainda mostrar, a chave legada **anon** (`eyJ...`)
- `NEXT_PUBLIC_APP_URL` (opcional)

**Não** coloque `sb_secret_` / `service_role` no Next.js: isso é chave de servidor com acesso total e não deve ir em variável `NEXT_PUBLIC_*` nem no browser. Este MVP não precisa dela.

A captura pública usa funções SQL (`SECURITY DEFINER`) liberadas para o papel `anon`.

## Rodar

```bash
npm install
npm run dev
```

## Fluxo de teste

1. Crie conta em `/login` — na primeira entrada, o sistema cria sua **organização** e um **slug** inicial.
2. Vá em **Configurações**: preencha **WhatsApp** (ex.: `5511999998888` ou `11999998888`), ajuste **slug**, título e texto da landing.
3. Abra em aba anônima `/l/seu-slug`, preencha o formulário e clique **Chamar no WhatsApp** → o lead deve aparecer no **Painel** e no **Kanban** como **Novo**.
4. No Kanban, arraste o card entre colunas; use **Atualizar** no card para renovar o relógio da etapa (afeta os alertas por tempo).

## Rotas

| Rota | Uso |
|------|-----|
| `/` | Site comercial + plano Founder |
| `/login` | Acesso |
| `/dashboard` | Números por etapa |
| `/crm` | Kanban (`?alerta=1` filtra atenção) |
| `/configuracao` | Nome, slug, WhatsApp, textos da landing |
| `/l/[slug]` | Landing pública |
