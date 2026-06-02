import { useQuery } from "@tanstack/react-query";
import {
  proofService,
  IntegrityDashboardPayload,
} from "../services/proof.service";

export function useWorkspaceVerifications(slug: string) {
  return useQuery<IntegrityDashboardPayload, Error>({
    // Query key terstruktur menggunakan slug agar tidak bentrok antar-workspace
    queryKey: ["workspace-integrity", slug],

    // Panggil service internal
    queryFn: () => proofService.getIntegrityDashboard(slug),

    // Konfigurasi performa SaaS:
    // Data dianggap hangus (stale) setelah 1 menit untuk menghemat rate-limit API,
    // tapi tetap responsif kalau user pindah-pindah halaman.
    staleTime: 1000 * 60 * 1,

    // Jangan lakukan refetch otomatis saat window diklik jika slug tidak valid
    enabled: !!slug,
  });
}
