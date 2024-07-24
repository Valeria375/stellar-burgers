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

import { AppHeader, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation } from 'react-router-dom';

const App = () => {
  const location = useLocation();
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
              title={''}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            >
              <OrderInfo />
            </Modal>
          }
        />

        {/* <Route
          path='/ingredients/:id'
          element={
            <Modal
              title={''}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            ></Modal>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <Modal
              title={''}
              onClose={function (): void {
                throw new Error('Function not implemented.');
              }}
            >
              <OrderInfo />
            </Modal>
          }
        /> */}
      </Routes>
    </div>
  );
};

export default App;
