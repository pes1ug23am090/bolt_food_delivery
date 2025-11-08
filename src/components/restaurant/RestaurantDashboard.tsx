import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase, Restaurant, Dish, Order } from "../../lib/supabase";
import { LogOut, Utensils, Package, Plus, Edit2, Trash2 } from "lucide-react";

interface OrderWithCustomer extends Order {
  profiles: {
    full_name: string;
    phone: string | null;
  };
}

export default function RestaurantDashboard() {
  const { profile, signOut } = useAuth();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [view, setView] = useState<"orders" | "menu">("orders");
  const [showDishForm, setShowDishForm] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  const [dishForm, setDishForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    is_available: true,
  });

  useEffect(() => {
    if (profile?.id) loadRestaurant();
  }, [profile]);

  useEffect(() => {
    if (!restaurant) return;

    loadDishes();
    loadOrders();

    const subscription = supabase
      .channel("restaurant_orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurant.id}` },
        () => loadOrders()
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [restaurant]);

  // ✅ FIXED RESTAURANT LOADER
  const loadRestaurant = async () => {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", profile!.id);

      if (error) throw error;
      setRestaurant(data?.[0] || null);
    } catch (err) {
      console.error("Error loading restaurant:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDishes = async () => {
    if (!restaurant) return;
    const { data } = await supabase
      .from("dishes")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("category");

    setDishes(data || []);
  };

  const loadOrders = async () => {
    if (!restaurant) return;

    const { data } = await supabase
      .from("orders")
      .select(`*, profiles!customer_id(full_name, phone)`)
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false });

    const formatted = data?.map((o) => ({
      ...o,
      profiles: {
        full_name: o.profiles?.[0]?.full_name || "Unknown",
        phone: o.profiles?.[0]?.phone || null,
      },
    }));

    setOrders(formatted || []);
  };

  const saveDish = async () => {
    if (!restaurant || !dishForm.name || !dishForm.price || !dishForm.category) {
      alert("Fill all fields");
      return;
    }

    if (editingDish) {
      await supabase.from("dishes").update({
        name: dishForm.name,
        description: dishForm.description,
        price: parseFloat(dishForm.price),
        category: dishForm.category,
        is_available: dishForm.is_available,
      }).eq("id", editingDish.id);
    } else {
      await supabase.from("dishes").insert({
        restaurant_id: restaurant.id,
        name: dishForm.name,
        description: dishForm.description,
        price: parseFloat(dishForm.price),
        category: dishForm.category,
        is_available: dishForm.is_available,
      });
    }

    setDishForm({ name: "", description: "", price: "", category: "", is_available: true });
    setEditingDish(null);
    setShowDishForm(false);
    loadDishes();
  };

  const deleteDish = async (id: string) => {
    if (confirm("Delete this dish?")) {
      await supabase.from("dishes").delete().eq("id", id);
      loadDishes();
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    loadOrders();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-b-2 border-orange-500 rounded-full"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No restaurant assigned to this account.</p>
          <button onClick={signOut} className="bg-orange-500 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm p-4 flex justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Utensils className="text-white" />
          </div>
          <h1 className="text-xl font-bold">{restaurant.name}</h1>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setView("orders")} className="px-3 py-1 hover:bg-gray-200 rounded">
            Orders
          </button>
          <button onClick={() => setView("menu")} className="px-3 py-1 hover:bg-gray-200 rounded">
            Menu
          </button>
          <button onClick={signOut} className="px-3 py-1 hover:bg-gray-200 rounded flex items-center gap-1">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="p-6">

        {/* ORDERS VIEW */}
        {view === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <p className="text-center text-gray-600">No orders yet</p>
            )}
            {orders.map((order) => (
              <div key={order.id} className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold">Order #{order.id.slice(0, 6)}</h3>
                <p>Customer: {order.profiles.full_name}</p>
                <p>Amount: ₹{order.final_amount}</p>

                <div className="mt-2 flex gap-2">
                  {order.status === "pending" && (
                    <>
                      <button className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => updateOrderStatus(order.id, "accepted")}>Accept</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => updateOrderStatus(order.id, "cancelled")}>Reject</button>
                    </>
                  )}
                  {order.status === "accepted" && (
                    <button className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => updateOrderStatus(order.id, "preparing")}>Start Preparing</button>
                  )}
                  {order.status === "preparing" && (
                    <button className="bg-orange-500 text-white px-3 py-1 rounded"
                      onClick={() => updateOrderStatus(order.id, "ready")}>Mark Ready</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MENU VIEW */}
        {view === "menu" && (
          <div>
            <button
              onClick={() => { setShowDishForm(true); setEditingDish(null); }}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 mb-4 rounded"
            >
              <Plus size={16} /> Add Dish
            </button>

            {showDishForm && (
              <div className="bg-white p-4 rounded shadow mb-4">
                <input
                  placeholder="Name"
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={dishForm.price}
                  onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <input
                  placeholder="Category"
                  value={dishForm.category}
                  onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <textarea
                  placeholder="Description"
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="border p-2 w-full mb-2"
                />
                <button onClick={saveDish} className="bg-orange-500 text-white px-4 py-2 rounded">Save</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dishes.map((dish) => (
                <div key={dish.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{dish.name}</p>
                    <p className="text-sm">₹{dish.price}</p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => {
                      setEditingDish(dish);
                      setDishForm({
                        name: dish.name,
                        description: dish.description || "",
                        price: dish.price.toString(),
                        category: dish.category,
                        is_available: dish.is_available,
                      });
                      setShowDishForm(true);
                    }}>
                      <Edit2 size={20} className="text-blue-500" />
                    </button>

                    <button onClick={() => deleteDish(dish.id)}>
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
