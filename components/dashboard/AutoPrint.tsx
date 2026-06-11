"use client";

import { useEffect } from "react";

// Yazdırılabilir sayfa açılınca tarayıcının yazdır/PDF diyaloğunu tetikler.
export default function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 700);
    return () => clearTimeout(t);
  }, []);
  return (
    <button onClick={() => window.print()} className="print-hide" id="oy-print-btn">
      🖨️ Yazdır / PDF olarak kaydet
    </button>
  );
}
