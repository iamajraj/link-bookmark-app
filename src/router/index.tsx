import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../service/firebase';
import Main from '../pages/Main';
import Login from '../pages/Login';
import { useRecoilState } from 'recoil';
import { userState } from '../context/userState';

interface ChildrenProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ChildrenProps) => {
  const [user, setUser] = useRecoilState(userState);

  const navigate = useNavigate();
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/login');
      } else {
        setUser((state) => ({
          user: {
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            uid: user.uid,
          },
          isLoggedIn: true,
        }));
      }
    });
  }, [auth]);
  return children;
};

const AuthRoute = ({ children }: ChildrenProps) => {
  const [_, setUser] = useRecoilState(userState);

  const navigate = useNavigate();
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
        setUser((state) => ({
          user: {
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            uid: user.uid,
          },
          isLoggedIn: true,
        }));
      }
    });
  }, [auth]);
  return children;
};
export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
    ],
  },
]);
