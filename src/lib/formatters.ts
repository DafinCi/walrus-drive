/**
 * Memotong alamat wallet panjang menjadi string estetik 0xabc...1234
 */
export function formatTruncateWallet(address: string, digits = 4): string {
  if (!address) return "";
  if (address.length <= digits * 2 + 2) return address;
  return `${address.slice(0, digits + 2)}...${address.slice(-digits)}`;
}

/**
 * Mengubah ISO Date string menjadi penanda waktu relatif (Time Ago)
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Baru saja bergabung";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit yang lalu`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari yang lalu`;

  // Fallback jika sudah terlalu lama
  return date.toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
}
