'use client';
import { useCart } from '@/context/CartContext'
import CheckOut from './CheckOut'
import TestingPage from './TestingPage'
import ProfilePage from './ProfilePage';
import CloseComp from './CloseComp';
import OrderListPage from './OrderListPage';


const DynamicPage = () => {
  const { popupOpen, popupContent, closePopup } = useCart();

  const popupComponents = {
    CheckOut: <CheckOut />, 
    orderList: <OrderListPage />,
    // profile: <ProfilePage  />,
    // <TestingPage/> 
  };

  if (!popupOpen) return null;

  return (
    <div className="fixed w-full h-full inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl flex flex-col bg-white rounded-xl shadow-xl overflow-hidden">

        <div className="absolute top-4 right-5 z-10">
          <CloseComp />
        </div>

        <div className="flex-1 min-h-0">
          {popupComponents[popupContent]}
        </div>

      </div>
    </div>
  )
}

export default DynamicPage