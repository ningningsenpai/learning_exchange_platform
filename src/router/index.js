import { createRouter, createWebHistory } from 'vue-router';

import NavigationView from '@/views/navigation/navigation.vue';
import LoginView from '@/views/login/login.vue';
import RegisterView from '@/views/register/register.vue';
import LayoutView from '@/views/layout/layout.vue';
import searchBookView from '@/views/book/searchBook.vue';
import InitialForumView from '@/views/forum/initialForum.vue';
import InitialNewsView from '@/views/news/initialNews.vue';
import ShoppingCarView from '@/views/shoppingCar/shoppingCar.vue';
import BuyOrdersView from '@/views/orders/buyOrders.vue';
import UserHomePageView from '@/views/user/userHomePage.vue';
import BookDetailView from '@/views/book/bookDetail.vue';
import InitialBookView from '@/views/book/initialBook.vue';



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
      {path: 'initialNews', name: 'initialNews', component: InitialNewsView},
      {path: 'shoppingCar', name: 'shoppingCar', component: ShoppingCarView},
      {path: 'buyOrders', name: 'buyOrders', component: BuyOrdersView},
      {path: 'userHomePage', name: 'userHomePage', component: UserHomePageView},
      {path: 'bookDetail', name: 'bookDetail', component: BookDetailView},
      {path: 'initialBook', name: 'initialBook', component: InitialBookView}
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