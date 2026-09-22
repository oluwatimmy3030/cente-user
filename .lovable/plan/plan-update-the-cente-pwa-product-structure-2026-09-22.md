# Plan: Update the CENTE PWA product structure

## Goal
Refine the existing CENTE frontend-only PWA without changing the established bright gold, marble, premium design direction or official logo usage.

## Scope
- Keep everything mock and frontend-only.
- Do not add backend, database, banking, payment, KYC, Privy, Brails, or external service connections.
- Preserve the current CENTE visual system and improve existing screens rather than rebuilding from scratch.

## Main changes
1. **Remove discontinued items**
   - Remove USDT from balances, selectors, wallet cards, funding, sending, swaps, transactions, and copy.
   - Remove NIN from verification flows.
   - Replace “Redeem Gold” with “Sell Gold”.
   - Convert gold display from grams to OZ everywhere.

2. **Navigation and routes**
   - Update primary navigation to: Dashboard, Send Money, Transactions, Stocks & Shares, Wealth, Accounts, Settings, Help.
   - Keep Transactions available in navigation and Quick Actions, but reduce its prominence on the dashboard.
   - Add one combined “Stocks & Shares” page, not separate stock/share pages.
   - Map Accounts and Settings to polished frontend pages/views using existing profile/account functionality.

3. **Dashboard**
   - Keep the existing wallet balance hero style and enhance it.
   - Show total wallet balance, USD wallet first, NGN wallet second, balance hide/show, wallet selector, Fund Wallet button, Quick Actions, and recent activity.
   - Update Quick Actions to: Fund Wallet, Send Money, Transactions, Safevest USD, Safevest NGN, Safevest Gold.

4. **Fund Wallet**
   - Rework the funding flow for USD and NGN only.
   - Show mock bank-transfer destination details: bank name, account name, account number, and copy button.
   - Include clear steps: transfer money, enter amount sent, confirm transfer.
   - Add review details with amount, currency, notice, “I’ve Sent This” action, and cancel option.
   - Keep account details centralized in mock data so real backend values can replace them later.

5. **Send Money**
   - Add a dedicated Send Money page and redesign the send flow.
   - Include source wallet, destination currency, payout method, amount, available balance, mock exchange info, recipient details, and review confirmation.
   - Use progressive disclosure so USD ACH/SWIFT details appear only when relevant.

6. **Stocks & Shares**
   - Add a native CENTE investment page using mock stocks, prices, changes, holdings, portfolio value, share orders, and order history.
   - Use the same gold/light/marble visual language.

7. **Wealth / Safevest**
   - Upgrade Safevest USD, Safevest NGN, and Safevest Gold into savings-plan experiences.
   - Add Create Plan with amount, frequency where applicable, duration, expected returns, start/end dates, countdown, status, and maturity value.
   - Support durations: 1, 3, 6, 9, and 12 months.
   - Add lock choice: Withdraw Anytime or Safe Lock.
   - Show Active Plans and Pending Plans.

8. **Safevest Gold**
   - Display gold balance, weight in OZ, mock value, active plans, pending plans, and Create Plan.
   - Gold plan creation will show gold value, OZ weight, duration, expected return, maturity value, and withdrawal/lock preference.
   - Use “Sell Gold” consistently.

## Technical approach
- Update `src/data/mock-data.js` to centralize USD/NGN wallet data, bank-transfer details, Safevest plan mocks, stock/share mocks, and OZ conversion helpers.
- Update `src/state/cente-context.jsx` to persist the revised mock state and handle plan creation, funding, sending, selling gold, and USD/NGN-only logic.
- Update existing components in place: app shell, dashboard, wallet/accounts, transactions, wealth, profile/settings, and action flow.
- Add focused pages/components only where needed for Send Money, Stocks & Shares, Settings, Accounts, and Help.
- Keep styling token-based and consistent with `src/styles.css` utilities.

## Verification
- Scan source for banned terms: `USDT`, `NIN`, `Redeem Gold`, `redeem gold`, `grams`, `/g`, and visible gram units.
- Check the main pages and key flows in the running preview on desktop and mobile.
- Read the latest build diagnostics before reporting completion.
