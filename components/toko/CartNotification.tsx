"use client";

import { useEffect } from "react";

export type NotifPos = { left?: number; top?: number };

export default function CartNotification({
  pos,
  onClose,
}: {
  pos: NotifPos;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="cart-notification" style={pos}>
      <span>Berhasil ditambahkan ke keranjang!</span>
      <button className="notif-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}