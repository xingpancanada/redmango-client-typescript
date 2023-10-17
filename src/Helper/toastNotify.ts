import { ToastContainer, TypeOptions, toast } from 'react-toastify';

export default function toastNotify(message: string, type: TypeOptions) {
  toast(message, {
    type: type,
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    className: "toast-message",
    });
}