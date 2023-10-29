import routes from '~/config/routes';

import Home from '~/pages/Home';
import Day from '~/pages/Day';
import Translate from '~/pages/Translate';

const publicRoutes = [
    {
        path: routes.home,
        Component: Home,
    },
    {
        path: routes.day,
        Component: Day,
    },
    {
        path: routes.translate,
        Component: Translate,
    },
    {
        path: routes.translateAll,
        Component: Translate,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
