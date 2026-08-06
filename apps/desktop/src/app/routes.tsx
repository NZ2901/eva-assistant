import { ChatPage } from '../pages/ChatPage';
import { HomePage } from '../pages/HomePage';

export const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/chat',
    element: <ChatPage />,
  },
];