/**
 * Public API for the auth feature module.
 *
 * Consumers import from '@/features/auth', not from deep internal paths.
 * This keeps internal refactors isolated — moving wallet-connect-btn.tsx
 * to a different folder only requires updating this file.
 */
export { WalletConnectButton } from "./components/wallet-connect-btn";
