

// src/app/page.js
const dummyProducts = [
  { id: 1, name: 'Crispy Zinger Burger', price: 450, image: '🍔', category: 'Burgers' },
  { id: 2, name: 'Fried Chicken Bucket (6pc)', price: 1200, image: '🍗', category: 'Buckets' },
  { id: 3, name: 'Spicy Chicken Wrap', price: 380, image: '🌯', category: 'Wraps' },
  { id: 4, name: 'BBQ Wings (8pc)', price: 650, image: '🍗', category: 'Wings' },
  { id: 5, name: 'Loaded Fries', price: 350, image: '🍟', category: 'Sides' },
  { id: 6, name: 'Family Variety Box', price: 1800, image: '🍱', category: 'Deals' },
  { id: 7, name: 'Chicken Nuggets (10pc)', price: 420, image: '🍗', category: 'Sides' },
  { id: 8, name: 'Crown Special Pizza', price: 950, image: '🍕', category: 'Pizza' },
];

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="bg-blue-900 text-white rounded-2xl p-8 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to Crown Chicken 🍗</h1>
        <p className="text-blue-100">Order your favorite fast food — delivered hot &amp; fresh!</p>
      </div>

      {/* Products Grid */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Menu</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {dummyProducts.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="bg-gray-50 flex items-center justify-center h-32 text-5xl">
              {item.image}
            </div>
            <div className="p-4">
              <span className="text-xs text-blue-700 font-medium">{item.category}</span>
              <h3 className="font-semibold text-gray-800 mt-1">{item.name}</h3>
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-gray-900">Rs. {item.price}</span>
                <button className="bg-blue-900 hover:bg-blue-800 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
                  Add +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}