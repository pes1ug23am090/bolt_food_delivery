import { useState, useEffect } from 'react';
import { supabase, Order, Restaurant } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface OrderWithRestaurant extends Order {
  restaurants: Restaurant;
}

export default function OrderTracking() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();

    const subscription = supabase
      .channel('order_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `customer_id=eq.${user!.id}`,
      }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, restaurants(*)')
        .eq('customer_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600">Start ordering from your favorite restaurants!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Orders</h2>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const StatusIcon = getStatusIcon(order.status);
          return (
            <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl font-bold">
                      {order.restaurants.name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {order.restaurants.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString()} at{' '}
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-medium capitalize">{order.status}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    {order.estimated_delivery_time && (
                      <span>
                        ETA: {new Date(order.estimated_delivery_time).toLocaleTimeString()}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${order.final_amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.delivery_address && (
                  <p className="text-sm text-gray-600 mt-3">
                    Delivery to: {order.delivery_address}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
