# ResumeHub Web

Frontend do **ResumeHub** — console de carreira em modo terminal. Cadastre seu
inventário profissional no **Cofre**, monte **Perfis** curados por vaga e publique
um **Portfólio** público por slug.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · TanStack Query ·
React Hook Form + Zod · Axios.

## Arquitetura

```
src/
  app/
    (auth)/{login,register}        páginas de autenticação (sem chrome)
    (app)/                          área autenticada (sidebar + topbar + guard)
      dashboard | cofre | perfis | perfis/[id] (montagem) | portfolio
    p/[slug]/                       portfólio público (Server Component)
  components/
    ui/         primitivos (Button, Input, Card, Badge, Toggle, Modal, …)
    layout/     Sidebar, Topbar, MobileNav, AppShell (guard), ThemeToggle
    dashboard/ · cofre/ · perfis/ · resume/   features
  lib/
    api/        client axios (Bearer + refresh cookie em 401), endpoints por recurso
    auth/       access token + AuthProvider (refresh token é cookie HttpOnly)
    query/      QueryClient, query-keys e hooks (CRUD genérico do inventário)
    types.ts    tipos usados pela UI · api/schema.ts gerado do OpenAPI
```

Princípios: camada de API tipada espelhando os DTOs do backend, estado de servidor
com React Query (CRUD genérico parametrizado por recurso, espelhando o
`OwnedCrudController`), formulários validados com Zod, e tema claro/escuro via
CSS variables com toggle sem flash (script inline no root layout).

## Pré-requisitos

- Node.js 20.9+
- A **API** rodando (ver `../resumehub-api`). Por padrão em `http://localhost:5087`.
- A API precisa de **CORS** liberado para a origem do front (`Cors__WebOrigin`,
  default `http://localhost:3000`) — já configurado no projeto da API.

## Configuração

```bash
cp .env.example .env.local
# NEXT_PUBLIC_API_BASE_URL aponta para a API, incluindo o sufixo /api
# NEXT_PUBLIC_SITE_URL aponta para a origem pública do front
# NEXT_PUBLIC_SENTRY_DSN e SENTRY_DSN são opcionais
```

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (Turbopack) + checagem de tipos
npm run lint       # ESLint (flat config)
npm run test       # Vitest
npm run typegen    # gera src/lib/api/schema.ts a partir da API local
```

## Deploy (Vercel)

O repositório já está pronto para a Vercel (Next.js detectado automaticamente;
`vercel.json` fixa o framework e a região `pdx1` — Portland/Oregon, colada na API
no Render para o fetch server-side de `/p/[slug]`).

1. **Vercel → New Project** apontando para `github.com/ianfelps/resumehub-web`.
   Root Directory = raiz do repo (é o próprio app Next.js).
2. **Environment Variables** → defina `NEXT_PUBLIC_API_BASE_URL` com a URL da API
   publicada, incluindo `/api` (ex.: `https://resumehub-api.onrender.com/api`).
   Como é `NEXT_PUBLIC_*`, é embutida no build — refaça o deploy ao alterar.
3. Na **API** (Render), aponte `Cors__WebOrigin` para a origem da Vercel
   (ex.: `https://resumehub.vercel.app`) senão as chamadas do browser tomam CORS.
4. Build: `npm run lint && npm run build` (configurado no `vercel.json`) · Output: padrão do Next.

## Fluxo end-to-end

1. `/register` cria a conta e já autentica (access token no cliente; refresh token em cookie HttpOnly).
2. **Cofre**: adicione experiências, projetos, skills, idiomas, formação e cursos.
3. **Perfis → Novo perfil**: abre a Montagem; ligue/desligue itens do cofre e veja
   o currículo montar ao vivo. **Publicar** expõe o perfil.
4. **Portfólio / `/p/{slug}`**: a vitrine pública (anônima) do perfil publicado.

## Autenticação

Chamadas diretas do browser para a API. O access token é injetado pelo interceptor
do Axios; em `401` há uma tentativa única de `refresh` (single-flight) usando o
cookie HttpOnly da API. Se falhar, a sessão é limpa e o usuário é redirecionado
para `/login`. `POST /api/auth/logout` invalida o refresh token no backend.

## Contratos

Com a API rodando em `http://localhost:5087`, execute `npm run typegen` para gerar
`src/lib/api/schema.ts` a partir de `/openapi/v1.json`. Esse arquivo é gerado e
não deve ser editado manualmente.
