// Route constants for the application
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CHAT: '/chat',
};

// Navigation utilities
export const getRouteTitle = (pathname) => {
  switch (pathname) {
    case ROUTES.HOME:
      return 'Home';
    case ROUTES.LOGIN:
      return 'Login';
    case ROUTES.SIGNUP:
      return 'Sign Up';
    case ROUTES.CHAT:
      return 'Chat';
    default:
      return 'Chat App';
  }
};

// Check if route requires authentication
export const isProtectedRoute = (pathname) => {
  const protectedRoutes = [ROUTES.CHAT];
  return protectedRoutes.includes(pathname);
};

// Check if route should redirect authenticated users
export const isAuthRoute = (pathname) => {
  const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP];
  return authRoutes.includes(pathname);
};