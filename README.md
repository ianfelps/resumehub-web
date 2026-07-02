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
    api/        client axios (Bearer + refresh em 401), endpoints por recurso
    auth/       token-store (localStorage) + AuthProvider
    query/      QueryClient, query-keys e hooks (CRUD genérico do inventário)
    types.ts    espelho dos DTOs da API · enums.ts · format.ts
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
```

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (Turbopack) + checagem de tipos
npm run lint       # ESLint (flat config)
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
4. Build: `next build` · Output: padrão do Next. Sem ajustes extras.

## Fluxo end-to-end

1. `/register` cria a conta e já autentica (tokens em localStorage).
2. **Cofre**: adicione experiências, projetos, skills, idiomas, formação e cursos.
3. **Perfis → Novo perfil**: abre a Montagem; ligue/desligue itens do cofre e veja
   o currículo montar ao vivo. **Publicar** expõe o perfil.
4. **Portfólio / `/p/{slug}`**: a vitrine pública (anônima) do perfil publicado.

## Autenticação

Chamadas diretas do browser para a API. O access token é injetado pelo interceptor
do Axios; em `401` há uma tentativa única de `refresh` (single-flight) e, se falhar,
a sessão é limpa e o usuário é redirecionado para `/login`.
