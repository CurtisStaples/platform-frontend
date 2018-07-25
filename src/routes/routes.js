import DashboardLayout from '../components/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from '../components/GeneralViews/NotFoundPage.vue'

// Admin pages
import Overview from 'src/components/Dashboard/Views/Overview.vue'
import UserProfile from 'src/components/Dashboard/Views/UserProfile.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'
import Typography from 'src/components/Dashboard/Views/Typography.vue'
import Icons from 'src/components/Dashboard/Views/Icons.vue'
import Maps from 'src/components/Dashboard/Views/Maps.vue'
import Notifications from 'src/components/Dashboard/Views/Notifications.vue'
import ImportScreen from 'src/components/Dashboard/Views/Import/ImportScreen.vue'
import LoginScreen from 'src/components/Dashboard/Views/Login/LoginScreen.vue'

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/overview'
  },
  {
    path: '/login',
    name: 'LoginScreen',
    component: LoginScreen,
    meta: { requiresAuth: false}
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: Overview,
        meta: { requiresAuth: true }
      },
      {
        path: 'user',
        name: 'User',
        component: UserProfile,
        meta: { requiresAuth: true }
      },
      {
        path: 'table-list',
        name: 'Table List',
        component: TableList,
        meta: { requiresAuth: true }
      },
      {
        path: 'typography',
        name: 'Typography',
        component: Typography,
        meta: { requiresAuth: true }
      },
      {
        path: 'icons',
        name: 'Icons',
        component: Icons,
        meta: { requiresAuth: true }
      },
      {
        path: 'maps',
        name: 'Maps',
        component: Maps,
        meta: { requiresAuth: true }
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications,
        meta: { requiresAuth: true }
      },
      {
        path: 'import',
        name: 'Import',
        component: ImportScreen,
        meta: { requiresAuth: true }
      }
    ]
  },
  { path: '*', component: NotFound }
]

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes
