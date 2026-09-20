# CENTE User PWA

## Goal
Build a cohesive, installable CENTE user application with realistic frontend-only balances, transactions, wealth products, verification, PIN security, and notification/support interactions. No admin experience, backend, real authentication, live rates, or financial integrations will be added.

## Product structure
- Create an app shell with mobile bottom navigation and a tailored tablet/desktop sidebar/header.
- Build five primary destinations: Home, Wallet, Transactions, Wealth, and Profile.
- Add focused flows for onboarding, fund wallet, send money, currency swap, notifications, support, KYC, and PIN setup/verification.
- Give Safevest USD, Safevest NGN, and Safevest Gold dedicated product experiences, activity, charts, deposits, withdrawals, and Gold buy/redeem flows.

## Visual direction
- Preserve CENTE branding and use the specified deep charcoal, restrained gold, dark-gold, and marble-inspired material system.
- Use premium typography, subtle borders and elevation, compact financial charts, 48px touch targets, bottom sheets on mobile, and restrained micro-interactions.
- Keep Gold luxurious but readable; clearly separate quantity, value, invested amount, performance, and available balance.
- Create CENTE-branded PWA icons and favicon assets from the available identity rather than using template branding.

## State and mock architecture
- Centralize user, wallets, balances, rates, gold price/holdings, Safevest products, recipients, notifications, and transaction fixtures under `src/data`.
- Add a single app state provider with mock service-style actions for funding, sending, swapping, Safevest deposits/withdrawals, Gold purchases/redemptions, onboarding, KYC, and PIN flows.
- Keep calculation and validation logic outside page components so real API calls can replace mock operations later.
- Persist the prototype session locally so balances and created transactions remain consistent across screens and refreshes.

## Working interactions
- Currency switching updates dashboard balances using labeled mock rates.
- Funding, sends, swaps, savings actions, Gold purchases, and Gold redemptions validate inputs, show review/PIN/KYC steps, mutate mock balances, and append transaction history.
- Sensitive actions trigger mocked just-in-time verification and PIN confirmation as appropriate.
- Transactions support category/status filtering and detailed views, including Gold-specific fields.
- Notifications support read/unread state; support opens a functional mock conversation surface.
- Include explicit loading, empty, validation, pending, failed, insufficient-funds/holdings, verification-required, and mock market-unavailable states.

## PWA and responsive behavior
- Add installable manifest metadata, CENTE icons, theme color, and standalone display support.
- Add guarded offline app-shell support that never registers in development or Lovable preview and uses safe update behavior in production.
- Verify mobile, tablet, and desktop layouts; desktop receives multi-column composition rather than a stretched phone view.

## Technical implementation
- The project runtime is fixed to React 19, Vite, and TanStack Start/Router. The application will use that existing React routing foundation rather than replacing it with React Router DOM, while preserving the requested client-only product behavior and deployable Vite build.
- Use TypeScript/TSX already configured by the project; no backend functions, cloud services, or external financial APIs.
- Use existing reusable UI controls plus focused CENTE components for cards, selectors, sheets, transaction rows, charts, PIN keypad, and status indicators.
- Give every user-facing route complete app-specific metadata and remove all Lovable placeholder branding.

## Verification
- Validate state-changing flows end-to-end in the browser on mobile and desktop sizes.
- Confirm PWA metadata/icons, navigation, dialogs/sheets, charts, filters, and transaction updates.
- Confirm the preview and production build are error-free.
