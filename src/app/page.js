//src/app/page.js 
"use client";
import ItemsPage from "../components/ItemsPage";
import AddtoCart from "../components/AddtoCart";
import { useState } from "react";

export default function Home() {

  const [check, setCheck] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row  gap-5  px-5">

      <div className="flex-1 min-w-0">
        <ItemsPage check={check} setCheck={setCheck}/>
      </div>

      <div className="w-full lg:w-auto lg:shrink-0">
        <AddtoCart setCheck={setCheck} />
      </div>

    </div>
  );
}