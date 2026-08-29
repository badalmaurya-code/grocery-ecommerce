import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home, XCircle } from 'lucide-react';
import { OrderStatus } from '../types';

interface OrderTrackerProps {
  status: OrderStatus;
  timeline?: { status: string; timestamp: Date; note?: string }[];
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ status, timeline }) => {
  if (status === 'cancelled') {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800">
        <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
        <div>
          <h4 className="font-bold text-sm">Order Cancelled (ऑर्डर रद्द किया गया)</h4>
          <p className="text-xs text-rose-600">This order was cancelled and will not be delivered.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'pending', label: 'Order Placed', hindi: 'ऑर्डर दर्ज', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', hindi: 'स्वीकृत', icon: CheckCircle2 },
    { key: 'processing', label: 'Processing', hindi: 'तैयारी में', icon: Package },
    { key: 'packed', label: 'Packed', hindi: 'पैक किया गया', icon: Package },
    { key: 'out_for_delivery', label: 'Out for Delivery', hindi: 'डिलीवरी हेतु रवाना', icon: Truck },
    { key: 'delivered', label: 'Delivered', hindi: 'डिलीवर हो गया', icon: Home }
  ];

  const statusOrder = ['pending', 'confirmed', 'processing', 'packed', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full py-4">
      {/* Mobile/Desktop horizontal stepper */}
      <div className="relative flex items-center justify-between">
        {/* Background Track Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 z-0 transition-all duration-500"
          style={{ width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white text-stone-400 border-2 border-stone-200'
                } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="mt-2 text-center hidden xs:block">
                <p
                  className={`text-[11px] sm:text-xs font-bold leading-tight ${
                    isCompleted ? 'text-emerald-950' : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-stone-500 font-hindi hidden sm:block">
                  {step.hindi}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline notes if present */}
      {timeline && timeline.length > 0 && (
        <div className="mt-6 pt-4 border-t border-stone-100 space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500">Activity Log</h5>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {timeline.slice().reverse().map((t, idx) => (
              <div key={idx} className="text-xs flex items-start justify-between gap-3 text-stone-600">
                <span className="font-medium text-stone-900">• {t.note || `Status: ${t.status}`}</span>
                <span className="text-[11px] text-stone-400 shrink-0">
                  {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
