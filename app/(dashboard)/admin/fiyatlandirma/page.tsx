"use client";

import { useState, useEffect } from "react";

type Plan = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  duration: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
};

const empty = (): Omit<Plan, "id"> => ({
  name: "",
  description: "",
  price: "",
  duration: 60,
  features: [],
  isPopular: false,
  isActive: true,
  sortOrder: 0,
});

export default function FiyatlandirmaYonetimiPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState(empty());
  const [featureInput, setFeatureInput] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/pricing");
    const data = await res.json();
    setPlans(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(empty());
    setFeatureInput("");
    setShowForm(true);
  }

  function openEdit(p: Plan) {
    setEditing(p);
    setForm({ name: p.name, description: p.description || "", price: p.price, duration: p.duration, features: [...p.features], isPopular: p.isPopular, isActive: p.isActive, sortOrder: p.sortOrder });
    setFeatureInput("");
    setShowForm(true);
  }

  function addFeature() {
    if (!featureInput.trim()) return;
    setForm(f => ({ ...f, features: [...f.features, featureInput.trim()] }));
    setFeatureInput("");
  }

  function removeFeature(i: number) {
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    if (!form.name || !form.price) return;
    setSaving(true);
    const url = editing ? `/api/admin/pricing/${editing.id}` : "/api/admin/pricing";
    const method = editing ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, price: parseFloat(form.price) }) });
    await load();
    setShowForm(false);
    setSaving(false);
  }

  async function deletePlan(id: string) {
    if (!confirm("Bu paketi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
    await load();
  }

  async function toggleActive(p: Plan) {
    await fetch(`/api/admin/pricing/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, isActive: !p.isActive }) });
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fiyatlandırma Yönetimi</h1>
          <p className="text-gray-500 text-sm mt-1">Fiyatlandırma sayfasında görünen paketleri buradan yönetin</p>
        </div>
        <button onClick={openNew} className="bg-gold-500 text-white px-4 py-2 rounded-xl font-semibold hover:bg-gold-600 transition-colors text-sm">
          + Yeni Paket
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : plans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">Henüz paket eklenmemiş.</p>
          <button onClick={openNew} className="bg-gold-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-gold-600 transition-colors text-sm">
            İlk Paketi Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className={`bg-white rounded-2xl border p-6 relative ${p.isPopular ? "border-gold-400 shadow-md" : "border-gray-100"} ${!p.isActive ? "opacity-60" : ""}`}>
              {p.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full">Popüler</span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-navy-900">{p.name}</h3>
                  <p className="text-2xl font-bold text-gold-600 mt-1">₺{parseFloat(p.price).toLocaleString("tr-TR")}</p>
                  <p className="text-xs text-gray-400">{p.duration} dakika</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.isActive ? "Aktif" : "Pasif"}
                </span>
              </div>
              {p.description && <p className="text-gray-500 text-sm mb-3">{p.description}</p>}
              {p.features.length > 0 && (
                <ul className="space-y-1 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2 pt-3 border-t border-gray-50">
                <button onClick={() => openEdit(p)} className="flex-1 text-xs font-medium text-navy-700 border border-navy-200 rounded-lg py-1.5 hover:bg-navy-50 transition-colors">
                  Düzenle
                </button>
                <button onClick={() => toggleActive(p)} className="flex-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors">
                  {p.isActive ? "Pasif Yap" : "Aktif Yap"}
                </button>
                <button onClick={() => deletePlan(p.id)} className="text-xs font-medium text-red-500 border border-red-100 rounded-lg px-2.5 py-1.5 hover:bg-red-50 transition-colors">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-bold text-navy-900 text-lg">{editing ? "Paketi Düzenle" : "Yeni Paket"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Paket Adı *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ör: Başlangıç Paketi" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ücret (₺) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="350" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Süre (dakika)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))} placeholder="60" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Açıklama</label>
                <textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Paket hakkında kısa açıklama..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Özellikler</label>
                <div className="flex gap-2 mb-2">
                  <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Özellik ekle ve Enter'a bas..." className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400" />
                  <button onClick={addFeature} className="bg-gold-500 text-white px-3 rounded-xl text-sm font-medium hover:bg-gold-600 transition-colors">Ekle</button>
                </div>
                {form.features.length > 0 && (
                  <ul className="space-y-1.5">
                    {form.features.map((f, i) => (
                      <li key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                        <span className="text-gray-700">{f}</span>
                        <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPopular} onChange={e => setForm(f => ({ ...f, isPopular: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-700">Popüler olarak işaretle</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                  <span className="text-sm text-gray-700">Aktif</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">İptal</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-gold-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gold-600 disabled:opacity-50 transition-colors">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
