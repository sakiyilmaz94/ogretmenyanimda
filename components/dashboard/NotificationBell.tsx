"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { createPortal } from "react-dom";
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
  const [pos, setPos] = useState({ bottom: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

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
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  useEffect(() => { loadNotifications(); }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = supabase.channel(`user-${session.user.id}`);
    channel.on("broadcast", { event: "notification" }, (payload) => {
      setNotifications((prev) => [
        {
          id: `rt-${Date.now()}`,
          title: payload.payload.title,
          message: payload.payload.message,
          read: false,
          link: payload.payload.link ?? null,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    });
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (btnRef.current && btnRef.current.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        bottom: window.innerHeight - rect.top + 12,
        left: rect.left,
      });
    }
    setOpen((o) => !o);
  }

  const panel = open
    ? createPortal(
        <div
          style={{
            position: "fixed",
            bottom: pos.bottom,
            left: pos.left,
            width: 320,
            zIndex: 9999,
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Başlık */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              <p className="font-display font-semibold text-white text-sm">Bildirimler</p>
              {unread > 0 && (
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unread} yeni
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-white/50 hover:text-white transition-colors font-medium"
              >
                Tümünü oku
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-10 text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-white/40 text-sm">Henüz bildirim yok</p>
              </div>
            ) : (
              notifications.slice(0, 15).map((n) => {
                const content = (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-snug flex-1 ${!n.read ? "text-white" : "text-white/60"}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0" />}
                    </div>
                    <p className="text-[12px] text-white/40 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[11px] text-white/25 mt-1.5">
                      {new Date(n.createdAt).toLocaleString("tr-TR", {
                        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </>
                );

                return (
                  <div
                    key={n.id}
                    onClick={() => { markRead(n.id); if (n.link) setOpen(false); }}
                    className={`px-4 py-3 border-b border-white/5 last:border-0 cursor-pointer transition-colors duration-150 ${
                      !n.read ? "bg-primary/10 hover:bg-primary/15" : "hover:bg-white/5"
                    }`}
                  >
                    {n.link ? (
                      <Link href={n.link} className="block">{content}</Link>
                    ) : content}
                  </div>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`relative p-2 rounded-full transition-all duration-200 ${
          open
            ? "bg-white/20 text-inverse-on-surface"
            : "text-inverse-on-surface/60 hover:bg-white/10 hover:text-inverse-on-surface"
        }`}
        aria-label="Bildirimler"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-on-error text-[10px] rounded-full flex items-center justify-center font-bold leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {panel}
    </>
  );
}
