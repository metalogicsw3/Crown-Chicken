//src/app/page.js
"use client";
import ItemsPage from "../components/ItemsPage";
import AddtoCart from "../components/AddtoCart";

export default function Home() {

  return (
    <div className="flex flex-col lg:flex-row  gap-2 pl-2 ">
      <div className="flex-1 min-w-0">
        <ItemsPage />
      </div>

      <div className="w-full lg:w-110 min-h-0 h-[90vh] lg:shrink-0 px-2">
        <AddtoCart />
      </div>
    </div>
  );
}
