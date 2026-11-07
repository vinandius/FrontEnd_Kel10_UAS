"use client";

import { useEffect } from "react";

export type NotifPos = { left?: number; top?: number };

export default function CartNotification({
  pos,
  message,
  onClose,
}: {
  pos: NotifPos;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="cart-notification" style={pos}>
      <span>{message}</span>
      <button className="notif-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}