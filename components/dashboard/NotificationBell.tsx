"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  async function loadNotifications() {
    const res = await fetch("/api/notifications");
    if (res.ok) setNotifications(await res.json());
  }

  async function markAllRead() {
    await fetch("/api/notifications/all/read", { method: "DELETE" });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  // Supabase Realtime broadcast
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase.channel(`user-${session.user.id}`);

    channel.on("broadcast", { event: "notification" }, (payload) => {
      const newNotif: Notification = {
        id: `rt-${Date.now()}`,
        title: payload.payload.title,
        message: payload.payload.message,
        read: false,
        link: payload.payload.link ?? null,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    channel.subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [session?.user?.id]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-full text-inverse-on-surface/60 hover:bg-surface-container-lowest/10 hover:text-inverse-on-surface transition"
        aria-label="Bildirimler"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error-container text-on-error-container text-caption rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface-container-lowest rounded-md border border-outline-variant z-50 overflow-hidden soft-card-static">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
            <p className="font-display font-semibold text-on-background text-label-md">Bildirimler</p>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-caption text-primary hover:underline font-semibold">
                Tümünü oku
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-on-surface-variant text-body-md">Bildirim yok</p>
              </div>
            ) : (
              notifications.slice(0, 15).map((n) => (
                <div
                  key={n.id}
                  onClick={() => { markRead(n.id); if (n.link) setOpen(false); }}
                  className={`px-4 py-3 border-b border-outline-variant last:border-0 cursor-pointer hover:bg-surface-container-low transition ${!n.read ? "bg-primary-fixed/30" : ""}`}
                >
                  {n.link ? (
                    <Link href={n.link} className="block">
                      <p className={`text-label-md font-medium ${!n.read ? "text-on-background" : "text-on-surface-variant"}`}>{n.title}</p>
                      <p className="text-caption text-on-surface-variant mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-caption text-outline mt-1">{new Date(n.createdAt).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </Link>
                  ) : (
                    <>
                      <p className={`text-label-md font-medium ${!n.read ? "text-on-background" : "text-on-surface-variant"}`}>{n.title}</p>
                      <p className="text-caption text-on-surface-variant mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-caption text-outline mt-1">{new Date(n.createdAt).toLocaleString("tr-TR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                    </>
                  )}
                  {!n.read && <span className="inline-block w-2 h-2 bg-primary rounded-full mt-1" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
