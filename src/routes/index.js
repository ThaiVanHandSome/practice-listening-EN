import routes from '~/config/routes';

import Home from '~/pages/Home';
import Day from '~/pages/Day';
import Translate from '~/pages/Translate';
import Test from '~/pages/Test';
import TestVocabulary from '~/pages/TestVocabulary';

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
    {
        path: routes.test,
        Component: Test,
    },
    {
        path: routes.testVocabulary,
        Component: TestVocabulary,
    },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
