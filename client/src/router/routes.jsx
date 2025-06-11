import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import Layout from '../components/Layout';
import ProjectPage from '../pages/ProjectPage';
import HomePage from '../pages/HomePage';
import BacklogPage from '../pages/BacklogPage';

console.log('setup wordt geladen');

const rootRoute = createRootRoute({
  component: Layout,
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

const backlogRoute = createRoute({
  path: '/projects/$documentId/backlog',
  getParentRoute: () => rootRoute,
  component: BacklogPage,
});

const routeTree = rootRoute.addChildren([homeRoute, projectRoute, backlogRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});


