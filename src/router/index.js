import { createRouter, createWebHistory } from 'vue-router';

import NavigationView from '@/views/navigation/navigation.vue';
import LoginView from '@/views/login/login.vue';
import RegisterView from '@/views/register/register.vue';
import LayoutView from '@/views/layout/layout.vue';
import searchBookView from '@/views/book/searchBook.vue';
import InitialForumView from '@/views/forum/initialForum.vue';
import InitialChatsView from '@/views/news/initialChats.vue';
import ShoppingCarView from '@/views/shoppingCar/shoppingCar.vue';
import BuyAndSoldOrdersView from '@/views/orders/buyAndSoldOrders.vue';
import UserHomePageView from '@/views/user/userHomePage.vue';
import BookDetailView from '@/views/book/bookDetail.vue';
import InitialBookView from '@/views/book/initialBook.vue';
import SoldOrderDetailView from '@/views/orders/soldOrderDetail.vue';
import BuyOrderDetailView from '@/views/orders/buyOrderDetail.vue';
import ForumDetailView from '@/views/forum/forumDetail.vue';
import ReleaseForumView from '@/views/forum/releaseForum.vue';



const routes = [
  {
    path: '/',
    name: 'layout', 
    component: LayoutView,
    redirect: '/navigation',
    children:
    [
      {path: 'navigation', name: 'navigation', component: NavigationView},
      {path: 'searchBook', name: 'searchBook', component: searchBookView},
      {path: 'initialForum', name: 'initialForum', component: InitialForumView},
      {path: 'initialChats', name: 'initialChats', component: InitialChatsView},
      {path: 'shoppingCar', name: 'shoppingCar', component: ShoppingCarView},
      {path: 'buyAndSoldOrders', name: 'buyAndSoldOrders', component: BuyAndSoldOrdersView},
      {path: 'userHomePage', name: 'userHomePage', component: UserHomePageView},
      {path: 'bookDetail', name: 'bookDetail', component: BookDetailView},
      {path: 'initialBook', name: 'initialBook', component: InitialBookView},
      {path: 'soldOrderDetail', name: 'soldOrderDetail', component: SoldOrderDetailView},
      {path: 'BuyOrderDetail', name: 'BuyOrderDetail', component: BuyOrderDetailView},
      {path: 'forumDetail', name: 'forumDetail', component: ForumDetailView},
      {path: 'releaseForum', name: 'releaseForum', component: ReleaseForumView}
    ]
  },
  {path: '/login', name: 'login', component: LoginView},
  {path: '/register', name: 'register', component: RegisterView}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router;