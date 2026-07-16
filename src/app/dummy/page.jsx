// This page is only for testing
"use client";
import TestingPage from "@/components/TestingPage";
import { useRouter } from "next/navigation";

const Dummy = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-[92vh] overflow-y-auto">
      <TestingPage />
    </div>
  );
};

export default Dummy;
