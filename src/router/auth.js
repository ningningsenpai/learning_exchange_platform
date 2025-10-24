// 用户认证相关工具函数
export const setUserToken = (token) => {
  localStorage.setItem('userToken', token);
};

export const getUserToken = () => {
  return localStorage.getItem('userToken');
};

export const removeUserToken = () => {
  localStorage.removeItem('userToken');
};

export const isLoggedIn = () => {
  return !!getUserToken();
};

export const setUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

export const removeUserInfo = () => {
  localStorage.removeItem('userInfo');
};

export const logout = () => {
  removeUserToken();
  removeUserInfo();
};

export const needAuthRoutes = [
  '/userHomePage',
  '/shoppingCar',
  '/buyOrders',
  '/sellOrders'
];

export const isNeedAuth = (path) => {
  return needAuthRoutes.includes(path);
};