import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages'; // Import all your page components
import { Modal } from '@components';
const App = () => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Protected Routes */}
        {/* <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/profile/orders' element={<ProfileOrders />} /> */}

        {/* Modals */}
        {/* <Route
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
      /> */}

        {/* <Route
        path='/ingredients/:id'
        element={
          <Modal
            title={''}
            onClose={function (): void {
              throw new Error('Function not implemented.');
            }}
          >
            
          </Modal>
        }
      /> */}

        {/* <Route
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

        {/* Catch-all route for 404 */}
        {/* <Route element={<NotFound404 />} /> */}
      </Routes>
    </div>
  );
};

export default App;
