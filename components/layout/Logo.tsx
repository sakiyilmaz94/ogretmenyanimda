// Öğretmen Yanımda — marka logosu (ikon parçası).
// Kaynak: public/Logo/favico.png (öğretmen + öğrenci + açık kitap + parıltı).
// Tüm kullanım yerleri bu ikonu stilli "ÖğretmenYanımda" yazısıyla eşler.

import Image from "next/image";

export function LogoMark({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <Image
      src="/Logo/favico.png"
      alt="Öğretmen Yanımda logosu"
      width={96}
      height={96}
      priority
      className={`${className} object-contain`}
    />
  );
}

export default LogoMark;
