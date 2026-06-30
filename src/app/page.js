import ItemsPage from "../components/ItemsPage";
import AddtoCart from "../components/AddtoCart";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row  gap-5 max-w-[2000px]  px-5">
      <div className="flex-1 min-w-0">
        <ItemsPage />
      </div>

      <div className="w-full lg:w-auto lg:shrink-0">
        <AddtoCart />
      </div>

      
    </div>
  );
}