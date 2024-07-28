import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { userSelectors } from '../../services/userSlice';

type ProtectedRouteProps = {
  Auth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({ Auth, children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { getIsAuthChecked, getUser } = userSelectors;
  const user = useSelector(getUser);
  const isAuth = useSelector(getIsAuthChecked);

  if (!isAuth) {
    return <Preloader />;
  }

  if (!Auth && !user) {
    return (
      <Navigate
        replace
        to='/login'
        state={{
          from: { ...location, locationState: location.state?.locationState }
        }}
      />
    );
  }

  if (Auth && user) {
    const from = location.state?.from || { pathname: '/' };
    const locationState = location.state?.from?.locationState || null;
    return <Navigate replace to={from} state={{ locationState }} />;
  }

  return children;
};
