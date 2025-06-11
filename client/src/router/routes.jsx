
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';

import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import ProjectPage from '../pages/ProjectPage';

console.log('✅ [ROUTES] Router setup wordt geladen');

const rootRoute = createRootRoute({
  component: () => <Layout />, 
});

const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: HomePage,
});

const projectRoute = createRoute({
  path: '/projects/$documentId',
  getParentRoute: () => rootRoute,
  component: ProjectPage,
});

const routeTree = rootRoute.addChildren([homeRoute, projectRoute]);

export const router = createRouter({ routeTree });

console.log(' [ROUTES] Router is succesvol geëxporteerd');
