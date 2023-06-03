import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import Upload from '~/pages/Upload';
import HeaderOnly from '~/layouts/HeaderOnly';
import config from '~/config';
import VideoViewer from '~/components/VideoViewer';
import BlankLayout from '~/layouts/BlankLayout';
const publicRoutes = [
    {
        path: config.routes.home,
        component: Home,
    },
    {
        path: config.routes.profile,
        component: Profile,
    },
    {
        path: config.routes.upload,
        component: Upload,
        layout: HeaderOnly,
    },
    {
        path: config.routes.follow,
        component: Upload,
    },
    {
        path: config.routes.live,
        component: Upload,
    }, ,
    {
        path: config.routes.videoViewer,
        component: VideoViewer,
        layout: BlankLayout,
    }
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
