// lib/toast.js
import { toast } from 'react-hot-toast';

const defaultOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    padding: '16px 24px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '420px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
};

// Custom toast with Tailwind classes (using inline styles for compatibility)
export const showToast = {
  success: (message, options) => {
    toast.success(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: '#10B981',
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#10B981',
      },
    });
  },
  
  error: (message, options) => {
    toast.error(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: '#EF4444',
        color: '#FFFFFF',
      },
      iconTheme: {
        primary: '#FFFFFF',
        secondary: '#EF4444',
      },
    });
  },
  
  warning: (message, options) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: '#F59E0B',
        color: '#FFFFFF',
      },
      icon: '⚠️',
    });
  },
  
  info: (message, options) => {
    toast(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: '#3B82F6',
        color: '#FFFFFF',
      },
      icon: 'ℹ️',
    });
  },
  
  loading: (message, options) => {
    return toast.loading(message, {
      ...defaultOptions,
      ...options,
      style: {
        ...defaultOptions.style,
        background: '#6B7280',
        color: '#FFFFFF',
      },
    });
  },
  
  custom: (message, options) => {
    return toast(message, {
      ...defaultOptions,
      ...options,
    });
  },
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// For more complex custom toasts with Tailwind
export const customToast = (message, type) => {
  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  const colorClass = type ? colors[type] : 'bg-gray-700 text-white';
  
  toast.custom(
    (t) => (
      <div
        className={`${colorClass} px-6 py-4 rounded-xl shadow-lg border border-white/10 max-w-md flex items-center gap-3 animate-in slide-in-from-right-5`}
        onClick={() => toast.dismiss(t.id)}
      >
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
        <span className="font-medium">{message}</span>
      </div>
    ),
    {
      duration: 4000,
      position: 'top-right',
    }
  );
};