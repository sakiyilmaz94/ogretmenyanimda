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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-headline-md text-on-background">Fiyatlandırma Yönetimi</h1>
          <p className="text-label-md text-on-surface-variant mt-0.5">Fiyatlandırma sayfasında görünen paketleri buradan yönetin</p>
        </div>
        <button onClick={openNew} className="rounded-full bg-primary text-on-primary px-4 py-2 text-label-md hover:opacity-90 transition">
          + Yeni Paket
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant text-label-md">Yükleniyor...</div>
      ) : plans.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-md soft-card-static border border-outline-variant/20 p-12 text-center">
          <div className="bg-primary-fixed rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-on-primary-fixed-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="font-display text-headline-md text-on-background mb-2">Henüz paket eklenmemiş</h3>
          <p className="text-label-md text-on-surface-variant mb-4">İlk fiyatlandırma paketini oluşturmak için aşağıya tıklayın.</p>
          <button onClick={openNew} className="rounded-full bg-primary text-on-primary px-4 py-2 text-label-md hover:opacity-90 transition">
            İlk Paketi Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div key={p.id} className={`bg-surface-container-lowest rounded-md border p-6 relative soft-card ${p.isPopular ? "border-primary/40" : "border-outline-variant/20"} ${!p.isActive ? "opacity-60" : ""}`}>
              {p.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-caption font-bold px-3 py-1 rounded-full">Popüler</span>
              )}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-on-background text-body-md">{p.name}</h3>
                  <p className="font-display text-headline-md text-primary mt-1">₺{parseFloat(p.price).toLocaleString("tr-TR")}</p>
                  <p className="text-caption text-on-surface-variant">{p.duration} dakika</p>
                </div>
                <span className={`text-caption px-2 py-1 rounded-full font-semibold ${p.isActive ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant"}`}>
                  {p.isActive ? "Aktif" : "Pasif"}
                </span>
              </div>
              {p.description && <p className="text-on-surface-variant text-body-md mb-3">{p.description}</p>}
              {p.features.length > 0 && (
                <ul className="space-y-1 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="text-caption text-on-surface-variant flex items-center gap-1.5">
                      <span className="text-on-secondary-container">✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2 pt-3 border-t border-outline-variant/20">
                <button onClick={() => openEdit(p)} className="flex-1 text-caption font-medium rounded-full border border-outline-variant text-on-surface-variant py-1.5 hover:bg-surface-container transition">
                  Düzenle
                </button>
                <button onClick={() => toggleActive(p)} className="flex-1 text-caption font-medium rounded-full border border-outline-variant text-on-surface-variant py-1.5 hover:bg-surface-container transition">
                  {p.isActive ? "Pasif Yap" : "Aktif Yap"}
                </button>
                <button onClick={() => deletePlan(p.id)} className="text-caption font-medium rounded-full bg-error-container text-on-error-container px-2.5 py-1.5 hover:opacity-90 transition">
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
          <div className="bg-surface-container-lowest rounded-md shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20">
              <h2 className="font-display text-headline-md text-on-background">{editing ? "Paketi Düzenle" : "Yeni Paket"}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">Paket Adı *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="ör: Başlangıç Paketi" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-1.5">Ücret (₺) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="350" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-1.5">Süre (dakika)</label>
                  <input type="number" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 60 }))} placeholder="60" className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">Açıklama</label>
                <textarea value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Paket hakkında kısa açıklama..." className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-1.5">Özellikler</label>
                <div className="flex gap-2 mb-2">
                  <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addFeature())} placeholder="Özellik ekle ve Enter'a bas..." className="flex-1 border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-background bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={addFeature} className="rounded-full bg-primary text-on-primary px-3 text-label-md hover:opacity-90 transition">Ekle</button>
                </div>
                {form.features.length > 0 && (
                  <ul className="space-y-1.5">
                    {form.features.map((f, i) => (
                      <li key={i} className="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-1.5 text-body-md">
                        <span className="text-on-surface-variant">{f}</span>
                        <button onClick={() => removeFeature(i)} className="text-on-error-container hover:opacity-70 text-caption ml-2">✕</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPopular} onChange={e => setForm(f => ({ ...f, isPopular: e.target.checked }))} className="rounded" />
                  <span className="text-body-md text-on-surface-variant">Popüler olarak işaretle</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                  <span className="text-body-md text-on-surface-variant">Aktif</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-outline-variant/20 flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 rounded-full border border-outline-variant text-on-surface-variant py-2.5 text-label-md hover:bg-surface-container transition">İptal</button>
              <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-primary text-on-primary py-2.5 text-label-md hover:opacity-90 disabled:opacity-50 transition">
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
