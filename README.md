## Pryve Admin Dashboard – Developer Guide

### Scripts
```bash
npm run dev   # start local dev server
npm run build # production build
npm start     # run production server
```

### Folder structure
```
src/
  app/
    (auth)/login/page.tsx
    (dashboard)/dashboard/
      layout.tsx
      page.tsx
    layout.tsx           # root layout
    globals.css          # theme tokens + base styles
  components/
    layout/Sidebar.tsx
    layout/Topbar.tsx
    ui/                  # reusable primitives
      badge.tsx
      button.tsx
      card.tsx
      input.tsx
      label.tsx
      select.tsx
      textarea.tsx
  lib/
    utils.ts             # cn() helper
```

### Design tokens (Tailwind v4)
- Colors: `--primary`, `--accent`, `--muted`, status colors, and border/ring in `globals.css`.
- Radii: `--radius-sm|md|lg`.
- Utility base classes: `.button`, `.button-primary`, `.input`, `.card` for consistent UI.

### UI primitives
- Button: `<Button variant="primary|ghost" />`
- Input/Select/Textarea/Label: form controls styled with `.input`.
- Card: `Card`, `CardHeader`, `CardTitle`, `CardContent`.
- Badge: `variant="default|success|warning|destructive"`.

### Routing
- Root `/` redirects to `/dashboard`.
- Auth at `/login` (prototype form state only).

### Next steps
- Add real data fetching and charts to `dashboard/page.tsx`.
- Implement auth and guard dashboard routes.
