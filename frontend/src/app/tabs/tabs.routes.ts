import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page)
      },
      {
        path: 'profile',
        loadComponent: () => import('../tab2/tab2.page').then(m => m.Tab2Page)
      },
      {
        path: 'tracking',
        loadComponent: () => import('../tab3/tab3.page').then(m => m.Tab3Page)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  }
];
