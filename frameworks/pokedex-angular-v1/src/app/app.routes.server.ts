import {
  RenderMode,
  ServerRoute,
} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
  {
    path: 'sandbox/table-full-ssg-test', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'sandbox/table-full-ssr-test', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  }
];
