import { describe, it, expect } from "vitest";
import { generateReferenceCode } from "./payment-config";

describe("generateReferenceCode", () => {
  it("ÖY- ile başlar ve 4 karakterlik kod içerir", () => {
    expect(generateReferenceCode()).toMatch(/^ÖY-[A-Z0-9]{4}$/);
  });

  it("karışan karakterleri (0, O, I, 1) kullanmaz", () => {
    for (let i = 0; i < 100; i++) {
      const code = generateReferenceCode().slice(3); // "ÖY-" sonrası
      expect(code).not.toMatch(/[O0I1]/);
    }
  });

  it("her çağrıda kod üretir (çoğunlukla farklı)", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateReferenceCode()));
    expect(codes.size).toBeGreaterThan(1);
  });
});
