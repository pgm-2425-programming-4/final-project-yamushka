import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import Layout from '../components/Layout';
import ProjectPage from '../pages/ProjectPage';
import HomePage from '../pages/HomePage';
import BacklogPage from '../pages/BacklogPage';

const rootRoute = createRootRoute({
  component: Layout,
});

// home route
const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: HomePage,
});

// project route
const projectRoute = createRoute({
  path: '/projects/$documentId',
  getParentRoute: () => rootRoute,
  component: ProjectPage,
});

// backlog route
const backlogRoute = createRoute({
  path: '/projects/$documentId/backlog',
  getParentRoute: () => rootRoute,
  component: BacklogPage,
});

// alle routes samen vormen de route tree
const routeTree = rootRoute.addChildren([homeRoute, projectRoute, backlogRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

console.log('setup wordt geladen');