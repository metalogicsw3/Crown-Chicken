// This page is only for testing
'use client'
import ProfilePage from "@/components/ProfilePage"
import CheckOut2 from "@/components/TestingPage"
import { useRouter } from "next/navigation";

const Dummy = () => {

  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-[80vh]">
      Dummy Page
    {/* <button 
    onClick={() => {
      router.push('/profile')
    }}
    className=" border border-gray-300 px-3 py-2 text-white bg-blue-400 rounded-lg cursor-pointer">
      Click 
    </button> */}
    </div>
  )
}

export default Dummy



