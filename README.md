# NeuropGen

Plataforma web de psicoeducación genética y neuropsicológica para familias, pacientes, cuidadores y profesionales de salud.

## Stack

- Next.js + TypeScript
- TailwindCSS
- Supabase (Auth, Postgres, Storage)

## Ejecutar

```bash
npm install
npm run dev
```

En Windows PowerShell con política restrictiva puedes usar:

```bash
npm.cmd install
npm.cmd run dev
```

## Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Habilita Authentication con correo y contraseña, y crea un usuario administrador.
3. Ejecuta `supabase.sql` en el SQL Editor para crear la tabla `cms` y sus políticas RLS.
4. Crea un bucket público de Storage llamado `assets`.
5. Copia `.env.example` a `.env.local` y completa `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Project Settings > API).

Sin `.env.local`, la app funciona en modo demo con datos guardados en `localStorage`.

## Esquema de datos del CMS

La jerarquía administrable vive en la tabla `cms`, fila con `id = "site"` y columna `payload` (jsonb):

- `sections[]`
- `sections[].topics[]`
- `sections[].topics[].subtopics[]`
- `sections[].topics[].subtopics[].blocks[]`

Cada sección, tema y subtema tiene `order` y `status` (`published` o `draft`). Cada bloque tiene `type`, `order`, `title`, `text`, `url` y `label` según aplique.

Tipos de bloque: `text`, `image`, `video`, `pdf`, `link`, `note`.

Los archivos subidos desde Admin se guardan en el bucket de Supabase Storage `assets`, bajo `cms/{tipo de bloque}`.

## Arquitectura

- `src/app`: rutas públicas, rutas dinámicas por sección y panel administrador.
- `src/components`: navegación, filtros, estados vacíos y UI compartida.
- `src/lib/supabase.ts`: inicialización del cliente Supabase.
- `src/lib/cms-seed.ts`: contenido jerárquico inicial.
- `src/lib/cms-store.ts`: carga y guardado del documento `cms.site`.
- `src/lib/content-store.ts`: subida de archivos a Supabase Storage.
- `src/components/CmsPublic.tsx`: biblioteca pública, buscador, breadcrumbs y renderizado de bloques.
- `src/app/admin/CmsAdminClient.tsx`: editor visual jerárquico.
- `src/types/cms.ts`: contratos del CMS jerárquico.
