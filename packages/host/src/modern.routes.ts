/**
 * 配置式路由
 */
import { defineRoutes } from '@modern-js/runtime/config-routes';
import type { RouteConfig } from '@modern-js/runtime/config-routes';

function patchRemoteAppPath(routes: RouteConfig[]): RouteConfig[] {
  return routes.map(route => {
    const nextRoute: RouteConfig = { ...route };

    if (nextRoute.path === 'remote-app' || nextRoute.path === '/remote-app') {
      nextRoute.path = 'remote-app/*';
    }

    if (nextRoute.path === 'dy-remote-app' || nextRoute.path === '/dy-remote-app') {
      nextRoute.path = 'dy-remote-app/*';
    }

    if (nextRoute.children?.length) {
      nextRoute.children = patchRemoteAppPath(nextRoute.children);
    }

    return nextRoute;
  });
}

export default defineRoutes((_routeFns, fileRoutes) => patchRemoteAppPath(fileRoutes));
