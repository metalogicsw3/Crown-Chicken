// src/components/DynamicPage.jsx
'use client';
import { useCart } from '@/context/CartContext'
import CheckOut from './CheckOut'
import ProfilePage from './ProfilePage';
import CloseComp from './CloseComp';

const DynamicPage = () => {

  const {
    popupOpen,
    popupContent,
    closePopup,
  } = useCart();

  const popupComponents = {
    profile: <ProfilePage />,
    CheckOut: <CheckOut />
  };

  if (!popupOpen) return null;

  return (
<div className="fixed w-full h-full inset-0 z-50 bg-black/40 backdrop-blur-xl flex items-center justify-center">
  <div className="relative px-5 pt-10 pb-5 h-170 overflow-clip flex flex-col items-center gap-10 bg-white rounded-xl">

    <div className="absolute top-4 right-4">
      <CloseComp />
    </div>

    {popupComponents[popupContent]}

  </div>
</div>
  )
}

export default DynamicPage
