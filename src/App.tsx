import { Navigate, RouterProvider, createBrowserRouter } from 'react-router';
import { Root } from './components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, lazy: async () => ({ Component: (await import('./pages/home')).default }) },
      { path: 'candidates', lazy: async () => ({ Component: (await import('./pages/candidates')).Candidates }) },
      { path: 'candidates/:id', lazy: async () => ({ Component: (await import('./pages/candidates')).CandidatePage }) },
      { path: 'vision', lazy: async () => ({ Component: (await import('./pages/content')).Vision }) },
      { path: 'manifesto', lazy: async () => ({ Component: (await import('./pages/manifesto')).Manifesto }) },
      { path: 'manifesto/publication', lazy: async () => ({ Component: (await import('./pages/publication')).Publication }) },
      { path: 'counsels-room', lazy: async () => ({ Component: (await import('./pages/counsel')).CounselsRoom }) },
      { path: 'community', lazy: async () => ({ Component: (await import('./pages/community')).Community }) },
      { path: 'community/:slug', lazy: async () => ({ Component: (await import('./pages/community')).CommunityStoryPage }) },
      { path: 'team', element: <Navigate to="/community" replace /> },
      { path: 'faculty-pulse', lazy: async () => ({ Component: (await import('./pages/engage')).FacultyPulse }) },
      { path: 'join', lazy: async () => ({ Component: (await import('./pages/engage')).Join }) },
      { path: 'events', lazy: async () => ({ Component: (await import('./pages/engage')).Events }) },
      { path: 'events/:id', lazy: async () => ({ Component: (await import('./pages/engage')).EventDetail }) },
      { path: 'newsroom', lazy: async () => ({ Component: (await import('./pages/engage')).Newsroom }) },
      { path: 'newsroom/:id', lazy: async () => ({ Component: (await import('./pages/engage')).Article }) },
      { path: '*', lazy: async () => ({ Component: (await import('./pages/engage')).NotFound }) },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
