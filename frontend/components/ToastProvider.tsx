import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return <Toaster position="top-right" toastOptions={{
    style: { background: '#111827', color: '#fff', border: '1px solid #10b981' },
    success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
  }} />;
}
