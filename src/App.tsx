import { RouterProvider, createBrowserRouter } from 'react-router';
import { Root } from './components/layout';
import { CandidatePage, Candidates } from './pages/candidates';
import { Manifesto, Team, Vision } from './pages/content';
import { Article, EventDetail, Events, FacultyPulse, Join, NotFound, Newsroom } from './pages/engage';
import Home from './pages/home';

const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'candidates', Component: Candidates },
      { path: 'candidates/:id', Component: CandidatePage },
      { path: 'vision', Component: Vision },
      { path: 'manifesto', Component: Manifesto },
      { path: 'team', Component: Team },
      { path: 'faculty-pulse', Component: FacultyPulse },
      { path: 'join', Component: Join },
      { path: 'events', Component: Events },
      { path: 'events/:id', Component: EventDetail },
      { path: 'newsroom', Component: Newsroom },
      { path: 'newsroom/:id', Component: Article },
      { path: '*', Component: NotFound },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
