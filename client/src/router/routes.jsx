import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import Layout from '../components/Layout';
import ProjectPage from '../pages/ProjectPage';
import HomePage from '../pages/HomePage';
import BacklogPage from '../pages/BacklogPage';
import AboutPage from '../pages/AboutPage';

const rootRoute = createRootRoute({
  component: Layout,
});

// home route
const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: HomePage,
});

// about route
const aboutRoute = createRoute({
  path: '/about',
  getParentRoute: () => rootRoute,
  component: AboutPage,
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

// alle routes samen = de route tree
const routeTree = rootRoute.addChildren([homeRoute, aboutRoute, projectRoute, backlogRoute]);

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

console.log('setup wordt geladen');
