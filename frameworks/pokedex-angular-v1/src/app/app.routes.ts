import { Routes } from '@angular/router';

import { HomePage } from './pages/home-page/home-page';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
    },
    {
        path: 'pokedex',
        loadComponent: () => import('./pages/pokedex/pokedex-layout/pokedex-layout').then(c => c.PokedexLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/pokedex/pokedex-home/pokedex-home').then(c => c.PokedexHome)
            },
            {
                path: 'fiftyanimations',
                loadComponent: () => import('./pages/pokedex/fapages/fapages').then(c => c.Fapages)
            },
            {
                path: 'foldertree',
                loadComponent: () => import('./pages/pokedex/folder-tree-page/folder-tree-page').then(c => c.FolderTreePage)
            },
            {
                path: 'tabletest',
                loadComponent: () => import('./pages/pokedex/table-test-page/table-test-page').then(c => c.TableTestPage)
            },
            {
                path: 'kpistats',
                loadComponent: () => import('./pages/pokedex/kpi-stats-page/kpi-stats-page').then(c => c.KpiStatsPage)
            },
            {
                path: 'realtimes',
                loadComponent: () => import('./pages/pokedex/realtimes-page/realtimes-page').then(c => c.RealtimesPage)
            }

        ]
    },
    {
        path: 'sandbox',
        loadComponent: () => import('./pages/sandbox/sandbox-layout/sandbox-layout').then(c => c.SandboxLayout),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/sandbox/sandbox-home/sandbox-home').then(c => c.SandboxHome),
            },
            {
                path: 'table-full-csr-test',
                loadComponent: () => import('./pages/sandbox/sandbox-table-full-csr-page/sandbox-table-full-csr-page').then(c => c.SandboxTableFullCsrPage)
            },
            {
                path: 'table-full-ssr-test',
                loadComponent: () => import('./pages/sandbox/sandbox-table-full-ssr-page/sandbox-table-full-ssr-page').then(c => c.SandboxTableFullSSRPage)
            },
            {
                path: 'table-full-ssg-test',
                loadComponent: () => import('./pages/sandbox/sandbox-table-full-ssg-page/sandbox-table-full-ssg-page').then(c => c.SandboxTableFullSSGPage)
            }
        ]
    }
];
