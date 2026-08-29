"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle, Clock, Package, Truck, Copy, MessageCircle } from "lucide-react";

interface OrderStatus {
  id: string;
  resi: string;
  status: "pending" | "paid" | "cancelled" | "expired";
  tracking_link?: string;
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(amount);

const whatsappStoreLink = (resi: string) =>
  `https://wa.me/62812345678?text=Tracking%20resi%20${resi}`;

export default function PesananStatusPage() {
  const [order, setOrder] = useState<OrderStatus | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [resi, setResi] = useState<string>("");

  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const fetchOrder = useCallback(async (id: string) => {
    const response = await fetch(`/api/orders/${id}`);
    const data = await response.json();
    setOrder(data);
    setResi(data.resi);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (!resi) return;
      await fetchOrder(resi);

      if (status === "paid" && resi) {
        cancelled = true;
        clearInterval(timer);
      }
      if (status === "cancelled" || status === "expired") {
        cancelled = true;
        clearInterval(timer);
      }
    };

    const timer = setInterval(() => poll(), 5000);

    return () => {
      clearInterval(timer);
    };
  }, [fetchOrder, status, resi]);

  if (!order) {
    return (
      <div className="p-6">
        <Package className="w-6 h-6 text-gray-300 mr-3" />
        <span>Mengambil data pesanan...</span>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg max-w-md">
      <h1 className="text-2xl font-bold mb-4">Detail Pesanan</h1>

      {/* Status card */}
      <div className="p-4 mb-4 border rounded">
        <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
        <span>Resi: {order.resi}</span>
      </div>

      {/* Tracking link block: <a inserted before href={order.tracking_link} */}
      {order.tracking_link && (
        <a href={order.tracking_link} target="_blank" rel="noopener noreferrer">
          Lihat Tracking
        </a>
      )}

      {/* Status waktu */}
      <div className="mb-4">
        <Clock className="w-6 h-6 text-yellow-500 mr-3" />
        <span>Status: {order.status}</span>
      </div>

      {/* Detail pengiriman */}
      <div className="p-4 border rounded">
        <Truck className="w-6 h-6 text-blue-500 mr-3" />
        <span>Pengiriman sedang dalam proses</span>
      </div>

      {/* Copy resi handler */}
      <div className="mb-4 p-3 border rounded">
        <Copy className="w-6 h-6 text-gray-500 mr-3" onClick={() => navigator.clipboard.writeText(order.resi)} />
        <span>Copy Resi</span>
      </div>

      {/* WhatsApp block: <a inserted before href={whatsappStoreLink()} */}
      <div className="mt-4">
        <MessageCircle className="w-6 h-6 text-green-500 mr-3" />
        <a href={whatsappStoreLink(order.resi)} target="_blank" rel="noopener noreferrer">
          Chat WhatsApp
        </a>
      </div>
    </div>
  );
}
