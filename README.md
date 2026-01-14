## Getting Started

First, install the dependencies:

```bash
pnpm i
```

Second, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Folder Structure

src
├─ domain
│  ├─ entities.ts
│  ├─ policies
│  │  ├─ enrollmentPolicy.ts
│  │  └─ documentPolicy.ts
│  └─ ports
│     ├─ repositories.ts
│     └─ storage.ts
├─ services
│  ├─ authService.ts
│  ├─ enrollmentService.ts
│  ├─ documentService.ts
│  └─ exportService.ts
├─ infra
│  ├─ prisma
│  │  └─ client.ts
│  ├─ repositories
│  │  ├─ prismaProfessionalRepo.ts
│  │  ├─ prismaEnrollmentRepo.ts
│  │  ├─ prismaDocumentRepo.ts
│  │  └─ prismaExportRepo.ts
│  ├─ storage
│  │  ├─ localStorageAdapter.ts
│  │  └─ s3StorageAdapter.ts
│  └─ export
│     └─ csvExportAdapter.ts
└─ app (Next.js)
   └─ … (se detalla mas abajo)


app
├─ (public)
│  └─ favicon.ico
├─ (auth)
│  ├─ login
│  │  └─ page.tsx
│  └─ register
│     └─ page.tsx
├─ (dashboard)
│  ├─ layout.tsx
│  └─ obras-sociales
│     └─ page.tsx
├─ actions
│  ├─ auth.ts           // Server Actions: register, logout (si querés)
│  └─ obras-sociales.ts // Server Action: updateObrasSociales
├─ api
│  ├─ session
│  │  └─ route.ts       // POST login, DELETE logout
│  └─ profesionales
│     ├─ route.ts       // GET listado (admin) | POST crear (opcional)
│     └─ [id]
│        └─ approve
│           └─ route.ts // PATCH aprueba profesional
├─ layout.tsx
├─ page.tsx
└─ unauthorized.tsx      // (opcional) UX si usás unauthorized() experimental
components
├─ forms
│  ├─ FormField.tsx
│  └─ SubmitButton.tsx   // usa useFormStatus de React 19
├─ nav
│  └─ AppNav.tsx
└─ ui
   ├─ Card.tsx           // wrappers Tailwind (o reexport de shadcn/ui)
   ├─ Button.tsx
   └─ Input.tsx
lib
├─ auth.ts               // helpers cookie/session
├─ db.ts                 // “persistencia” en memoria
└─ validators.ts         // zod opcional; si no, validación nativa
styles
└─ globals.css           // @import "tailwindcss";
types
└─ index.ts
middleware.ts            // si querés checks por path (opcional)
next.config.ts
postcss.config.js
tailwind.css             // si preferís separar el @import + @theme


## Deploying App

### Desarrollo (hot reload con bind mount)
```bash
# 1) levantar MySQL + app dev
docker compose up -d mysql app-dev

# 2) ver logs de la app
docker compose logs -f app-dev
```

App en: http://localhost:3000

MySQL en: mysql://app_user:app_pass@localhost:3306/app_obras (desde tu host)

Prisma dentro del contenedor usa mysql como host (por .env.docker).

Producción local (build y run optimizados)
```bash
# crea la imagen y levanta MySQL + app-prod
docker compose up -d mysql app-prod

# logs
docker compose logs -f app-prod
```


docker compose down
docker compose build --no-cache app-dev
docker compose up -d mysql app-dev
docker compose logs -f app-dev