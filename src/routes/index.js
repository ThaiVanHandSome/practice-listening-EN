import routes from '~/config/routes';

import Home from '~/pages/Home';
import Day from '~/pages/Day';

const publicRoutes = [
    {
        path: routes.home,
        Component: Home,
    },
    {
        path: routes.day,
        Component: Day,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
