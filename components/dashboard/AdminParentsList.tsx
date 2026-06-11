"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export interface AdminParentRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  childCount: number;
  totalSpent: number;
  createdAt: string;
}

type SortKey = "spentDesc" | "name" | "children";

export default function AdminParentsList({ parents }: { parents: AdminParentRow[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("spentDesc");

  const visible = useMemo(() => {
    const term = q.trim().toLocaleLowerCase("tr");
    let list = parents.filter((p) =>
      !term || `${p.name} ${p.email} ${p.phone}`.toLocaleLowerCase("tr").includes(term)
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "tr");
      if (sort === "children") return b.childCount - a.childCount;
      return b.totalSpent - a.totalSpent;
    });
    return list;
  }, [parents, q, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="İsim, e-posta veya telefon ara…"
            className="w-full bg-surface-container rounded-full pl-9 pr-4 py-2.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <label className="flex items-center gap-2 text-label-md text-on-surface-variant">
          Sırala:
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-surface-container rounded-lg px-3 py-1.5 text-on-background text-label-md focus:outline-none focus:ring-2 focus:ring-primary/40">
            <option value="spentDesc">Harcama (çok → az)</option>
            <option value="name">İsim (A-Z)</option>
            <option value="children">Çocuk sayısı</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-md p-10 text-center soft-card-static border border-outline-variant/20">
          <p className="text-body-md text-on-surface-variant">Eşleşen veli yok.</p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 overflow-x-auto">
          <table className="w-full text-body-md min-w-[680px]">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Veli</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Telefon</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Çocuk</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold">Toplam Harcama</th>
                <th className="text-left px-5 py-3 text-label-md font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {visible.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-on-background">{p.name}</p>
                    <p className="text-caption text-on-surface-variant">{p.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-on-surface-variant">{p.phone || "—"}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-caption bg-primary-fixed text-on-primary-fixed px-2.5 py-1 rounded-full font-semibold">{p.childCount}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-on-secondary-container">{formatCurrency(p.totalSpent)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href={`/admin/parents/${p.id}`} className="text-caption text-primary font-semibold hover:underline whitespace-nowrap">
                      Detay →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
