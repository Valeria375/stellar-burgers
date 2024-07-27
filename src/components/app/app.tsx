import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth, userActions } from '../../services/userSlice';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleModalIngredientClose = () => {
    navigate('./');
  };
  const handleFeedModalClose = () => {
    navigate('./feed');
  };

  const handleProfileOrdersModalClose = () => {
    navigate('./profile/orders');
  };

  const profileOrderMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedOrderMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileOrderMatch || feedOrderMatch;
  useEffect(() => {
    dispatch(getIngredients());
    dispatch(checkUserAuth()).finally(() => dispatch(userActions.authCheck()));
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Protected Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/orders' element={<ProfileOrders />} />

        {/* Modals */}
        <Route
          path='/feed/:number'
          element={
            <Modal
              title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
              onClose={handleFeedModalClose}
            >
              <OrderInfo />
            </Modal>
          }
        />

        <Route
          path='/ingredients/:id'
          element={
            <Modal
              title='Детали ингредиента'
              onClose={handleModalIngredientClose}
            >
              <IngredientDetails />
            </Modal>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <Modal
              title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
              onClose={handleProfileOrdersModalClose}
            >
              <OrderInfo />
            </Modal>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
