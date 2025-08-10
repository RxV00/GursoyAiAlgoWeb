# Project Overview

## Purpose

This Next.js application provides instant quotes for custom architectural products such as windows, doors, and skylights. Visitors upload a photo or enter measurements and immediately see a rough price estimate. The goal is to streamline the quoting process so potential customers can gauge costs without needing to contact a representative first.

The intent is captured in the site metadata:

```typescript
export const metadata: Metadata = {
      title: 'Gursoylar - Instant Architectural Product Quotes',
  description: 'Get instant price estimates for custom windows, doors, and skylights',
}
```

And in the hero section of the marketing page:

```tsx
<h1 className="mb-8 text-6xl font-light leading-tight text-slate-900 md:text-7xl">
  Instant Quotes for
  <br />
  <span className="font-semibold text-blue-900">
    Custom Architectural Products
  </span>
</h1>
<p className="mx-auto mb-12 max-w-3xl text-xl text-slate-600 leading-relaxed md:text-2xl">
  Get accurate price estimates for windows, doors, and skylights in seconds.
  Upload a photo or enter measurements manually.
</p>
```

The measurement section reinforces this goal:

```tsx
<h2 className="text-5xl font-light text-slate-900 mb-6">
  Get Your <span className="font-semibold text-blue-900">Instant Quote</span>
</h2>
<p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
  Select a product and provide measurements to receive an accurate, professional price estimate
</p>
```

## Tech Stack

### Front End

- **Next.js 15** with **React 19** and **TypeScript**
- **Tailwind CSS 4** for styling (see `globals.css`)
- **Radix UI** components for accessible primitives (e.g., Tabs, Label)
- **React Hook Form** with **Zod** for form validation
- **@tanstack/react-query** for asynchronous data handling
- **Framer Motion** for future animations
- **Lucide React** icon set
- **Axios** for HTTP requests
- Utility libraries: `class-variance-authority`, `clsx`, `tailwind-merge`

### Back End / Tooling

- **Prisma** ORM (schema in `prisma/schema.prisma`) with a PostgreSQL datasource
- **Supabase** authentication helpers (planned integration)
- **Sharp** for image processing
- Development tooling: ESLint, TypeScript, Tailwind CSS plugins

This stack allows rapid development of a responsive UI while laying the groundwork for future database and authentication features via Prisma and Supabase.

## Current Limitations

At this stage the core pricing algorithms are still under development. The client-side `calculatePrice` function only performs very basic area-based multiplication. Without the finalized algorithms, the dedicated calculations page and any advanced quoting logic cannot yet be implemented.

## Planned Features

- **Personalized quotes** – once we receive the algorithm specification, each product will be priced according to detailed rules so customers get accurate estimates.
- **Account system** – login and registration pages will let users store measurements and revisit past quotes.
- **Pop-up guidance** – on-page tips and numeric helpers will assist users in entering measurements correctly.
- **Polished interface** – a modern, visually appealing GUI built with Tailwind CSS and Framer Motion animations will help capture user interest.

Reliable calculations are crucial. When the official pricing algorithms become available, we will integrate them server-side to ensure every quote is trustworthy and consistent.
