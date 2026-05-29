/**
 * Mengubah string nama biasa menjadi format slug URL yang bersih dan aman.
 * Fungsi ini otomatis membuang special characters dan emoji agar patuh pada aturan DB.
 * * Contoh:
 * - "Tresto Labs" -> "tresto-labs"
 * - "Alpha & Omega Team 🔥" -> "alpha-omega-team"
 * - "-- Labs-- " -> "labs"
 */
export function generateSlug(name: string): string {
  return (
    name
      .toLowerCase()
      // 1. Ganti semua spasi, karakter khusus, dan emoji menjadi tanda hubung (-)
      .replace(/[^a-z0-9]+/g, "-")
      // 2. Bersihkan tanda hubung ganda yang berurutan (misal: "a--b" menjadi "a-b")
      .replace(/-+/g, "-")
      // 3. Potong tanda hubung yang menggantung di awal atau akhir string
      .replace(/^-+|-+$/g, "")
  );
}
