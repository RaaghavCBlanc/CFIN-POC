import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en/blog',
  },
  {
    path: ':locale',
    loadComponent: () =>
      import('./layouts/locale-layout.component').then(m => m.LocaleLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'blog',
      },
      {
        path: 'blog',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/blog-list/blog-list.component').then(m => m.BlogListComponent),
      },
      {
        path: 'blog/:slug',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./pages/products-list/products-list.component').then(m => m.ProductsListComponent),
      },
      {
        path: 'products/:slug',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./pages/sign-up/sign-up.component').then(m => m.SignUpComponent),
      },
      {
        path: ':slug',
        loadComponent: () =>
          import('./pages/dynamic-page/dynamic-page.component').then(m => m.DynamicPageComponent),
      },
    ],
  },
];
