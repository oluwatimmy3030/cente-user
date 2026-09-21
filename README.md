# CENTE Wealth Hub

Build a complete mobile-first React + Vite Progressive Web App (PWA) for the CENTE user application.

This is the USER-SIDE APPLICATION ONLY.

IMPORTANT:

Do NOT build an admin dashboard or admin portal.

The admin/backoffice will be a completely separate project on a separate domain and will be handled independently.

Do NOT build backend infrastructure.

Do NOT connect to MongoDB, Brails, QoreID, Privy APIs, payment gateways, or any real financial API.

All data, balances, transactions, rates, verification responses, etc. must be MOCK DATA.

The application should behave like a realistic, polished financial app entirely through frontend state and mock data.

The architecture should make it easy for a real backend/API to be connected later.

1. TECHNOLOGY REQUIREMENTS

Use:

React

Vite

JavaScript / JSX

React Router

PWA support

Responsive CSS

Component-based architecture

Clean reusable components

Local/mock state only

Do NOT use:

TanStack

Next.js

unnecessary frameworks

unnecessary backend services

Supabase

Firebase

real authentication providers

real payment integrations

The final project must run with:

npm install
npm run dev
npm run build

and produce a deployable Vite dist folder.

Make the PWA installable and ensure the application works properly on mobile, tablet, and desktop.

2. PRODUCT DIRECTION

CENTE is a digital wealth and payments application.

V1 supports:

NGN

USD

USDT

Gold through Safevest Gold

Do NOT include active EUR, USDC, or other asset products in this V1 user application.

Those can be added in future releases.

The existing PHP MVP should be treated as a functional reference only.

We are NOT redesigning it screen-for-screen.

Use its existing functionality and flows as inspiration, but create a significantly cleaner, more modern, polished React PWA.

The existing CENTE brand identity and color direction should remain recognizable.

Reference the current CENTE visual identity from:

https://www.gocente.com/

Use the CENTE brand direction together with the provided gold/marble visual framework.

3. VISUAL DESIGN SYSTEM

The visual direction should feel:

premium

modern

trustworthy

fintech

wealth-focused

clean

sophisticated

mobile-first

Primary visual framework:

Gold / marble / deep-dark palette.

Core colors:

Gold: #D4AF37

Dark gold: #8B7500

Deep background: #1F1F24

Use these as the foundation rather than introducing unrelated bright colors.

Use subtle marble-inspired textures/gradients where appropriate, but DO NOT make the interface look like a literal marble website.

The gold should be an accent and premium visual element, not an overwhelming color covering the entire UI.

Use:

soft elevation shadows

subtle borders

rounded cards

premium gradients

clean typography

strong spacing hierarchy

smooth transitions

subtle micro-interactions

Avoid excessive glassmorphism.

The interface should look like a real premium financial application rather than a generic AI-generated dashboard.

4. MOBILE-FIRST DESIGN

This is primarily a mobile PWA.

Design the mobile experience first.

All important interactive elements must have approximately 48px minimum touch targets.

The application should feel natural when used with one hand.

Use:

bottom sheets

mobile-friendly modals

bottom navigation

sticky action areas where appropriate

touch-friendly cards

swipe/scroll-friendly horizontal sections

large readable balances

clear confirmation states

Then adapt the same design intelligently for tablet and desktop.

Do NOT simply stretch the mobile UI onto desktop.

5. APP SHELL / NAVIGATION

Create a consistent application shell.

Mobile should have a clean bottom navigation structure such as:

Home

Wallet

Transactions

Wealth

Profile

Use appropriate icons.

The exact navigation can be refined based on the existing MVP flows, but it must remain simple and intuitive.

Desktop/tablet can use a more spacious navigation/header structure while preserving the same visual system.

Include:

CENTE logo

profile/avatar access

notification icon where appropriate

support/help access

Do not add unnecessary navigation items.

6. ONBOARDING

Create a polished onboarding/authentication experience.

The intended real-world flow is:

User taps Sign In / Get Started

Privy authentication would normally occur

User completes a lightweight profile

User enters the application

For this frontend prototype, MOCK the authentication.

Do not connect Privy.

Create a realistic mock authentication modal/screen.

After mock authentication, show a profile completion bottom sheet.

Fields:

First Name

Last Name

Country

Country flag selector

International phone number

The country selector should have searchable countries and flags.

The phone field should support international dialing codes.

Keep onboarding lightweight.

Do not ask for unnecessary information at registration.

7. MAIN DASHBOARD

Create the main CENTE dashboard.

The dashboard should be one of the strongest parts of the application.

Hero section:

A premium gold/marble balance card.

Display:

Total Balance

selected currency

hide/show balance button

account/wallet identifier where appropriate

Example mock balance:

₦1,250,450.00

Allow the user to toggle between:

NGN

USD

USDT

Gold

The balance should update visually when the selected currency changes.

Use mock exchange rates and mock gold pricing.

Do not claim these rates are real.

8. QUICK ACTIONS

Create a polished Quick Actions section.

V1 actions:

Fund Wallet

Send Money

Safevest USD

Safevest NGN

Safevest Gold

USDT Swap

These should be easy to access from the dashboard.

Use premium icon-based pills/cards.

Do not overload the dashboard with too many actions.

9. FUND WALLET

Create a complete frontend Fund Wallet flow using mock data.

The user should be able to select the funding method/currency and see the relevant interface.

For example:

NGN:

Bank transfer

Account details

Amount

Reference

USD:

funding information

USDT:

network/address information

Gold:

Gold funding or purchase information

amount or value to invest

estimated gold quantity

applicable mock rate

Everything is mock.

No actual deposits or gold purchases should occur.

The UI should clearly communicate that this is a prototype/mock environment where necessary.

Create:

amount entry

currency or asset selection

confirmation screen

success state

transaction created state

10. SEND MONEY

Create a complete frontend Send Money experience.

The user should be able to:

Select currency

Enter/select recipient

Enter amount

Review transaction

Confirm

See success screen

See transaction reflected in mock transaction history

Support NGN/USD/USDT where appropriate.

Gold should not be treated as a regular peer-to-peer sending currency unless explicitly supported by the product flow. For V1, Gold should primarily be used through Safevest Gold for buying, holding, and withdrawing/redeeming where appropriate.

Use mock recipients.

Include:

amount validation

insufficient balance state

confirmation screen

transaction fee display

recipient details

success state

error state

No actual money movement.

11. CURRENCY SWAP

Create a polished currency conversion/swap flow.

V1 supports:

NGN ↔ USD
NGN ↔ USDT
USD ↔ USDT where appropriate for the mock experience

Gold should have its own Safevest Gold purchase, conversion, and redemption flow rather than being presented as a standard currency swap.

Use mock exchange rates.

Show:

From currency

To currency

amount

estimated received amount

rate

fee

confirmation

success state

Make the swap interface extremely clear.

12. SAFEVEST USD

Create the Safevest USD wealth/savings experience.

Include:

Safevest USD overview

current balance

amount deposited

performance/earnings

rate/APY-style information

transaction/activity history

product information

deposit/add funds action

withdraw action where appropriate

Use mock data.

Create a simple, elegant performance graph.

The graph should look professional and financial-app appropriate.

Do not make unrealistic claims about returns.

13. SAFEVEST NGN

Create the Safevest NGN experience using the same design language.

Include:

balance

savings amount

performance

earnings

rate information

activity

add funds

withdrawal

performance chart

Use mock data.

The USD and NGN Safevest screens should feel like part of the same product family.

14. SAFEVEST GOLD

Create a dedicated Safevest Gold wealth experience.

Safevest Gold is an active V1 product and must be fully represented in the user application.

Include:

Safevest Gold overview

current gold balance

gold quantity held, such as grams

current mock gold price

total value of gold holdings

amount invested

performance and gains/losses

gold price/performance chart

product information

buy/add gold action

sell/redeem/withdraw action where appropriate

gold activity and transaction history

Use mock data only.

Do not connect to live gold pricing, commodity markets, payment providers, or custody systems.

The Safevest Gold experience should feel premium and wealth-focused while remaining consistent with the CENTE design system.

Use gold visual accents carefully. The screen should feel luxurious but still clear, readable, and functional.

The buy/add gold flow should include:

Select funding currency, such as NGN or USD

Enter amount to invest

Display estimated gold quantity

Display mock gold price

Display fees, if applicable

Review purchase

Confirm purchase

Show success state

Update mock gold balance and transaction history

The sell/redeem flow should include:

Display available gold quantity

Enter quantity or value to sell

Display estimated payout

Display mock price and fees

Review redemption

Confirm redemption

Show success state

Update mock gold balance and transaction history

Include appropriate states for:

insufficient balance

insufficient gold holdings

pending gold transaction

failed transaction

verification required

market unavailable mock state

Do not make guaranteed-return claims.

Clearly distinguish:

gold quantity

gold market value

invested amount

gains/losses

available balance

15. WALLET

Create a dedicated Wallet screen.

Show:

NGN balance

USD balance

USDT balance

Gold balance and quantity

total portfolio value

wallet/account information

recent activity

Fund Wallet

Send Money

Swap

Safevest access

Use clean cards rather than displaying everything in one dense block.

Gold should have a dedicated asset card showing:

gold quantity

current value

performance

Safevest Gold shortcut

16. TRANSACTIONS

Create a dedicated Transactions screen.

Use realistic mock transaction data.

Examples:

Funded Wallet

Sent Money

Received Money

USD Swap

USDT Swap

Safevest Deposit

Safevest Withdrawal

Safevest Gold Purchase

Safevest Gold Redemption

Gold Value Update

Each transaction should show:

icon

title

date/time

amount

currency or asset

status

Statuses:

Completed

Pending

Failed

Add simple filtering:

All

Money In

Money Out

Wealth

Swaps

Gold

Create a transaction details view.

Gold transaction details should show, where applicable:

gold quantity

price per gram

funding currency

transaction value

fees

estimated payout

status

17. JUST-IN-TIME KYC

KYC should NOT dominate onboarding.

The intended product behavior is:

Users can enter and explore the application before completing compliance verification.

When they initiate a transaction that requires verification, trigger the KYC experience.

Create a polished bottom-sheet verification flow.

For Nigerian users:

Step 1:
Choose:

BVN

NIN

Step 2:
Enter the relevant number.

Step 3:
Show mock verification/loading state.

Step 4:
Show either:

successful verification

verification failed

unable to verify

retry

Show clear visual feedback.

Successful verification should display an approval/verified badge.

Do NOT connect QoreID.

All verification results are mocked.

For foreign users, do not force Nigerian BVN/NIN verification in the V1 prototype.

Gold purchases, redemptions, and other regulated wealth actions may trigger the same just-in-time KYC flow where appropriate.

18. SECURITY PIN

Create a 4-digit security PIN experience.

Include:

PIN setup

Numeric keypad

4-digit PIN

confirm PIN

PIN verification

Create a PIN verification overlay/bottom sheet before sensitive actions.

Sensitive actions include:

sending money

funding wallet where applicable

currency swaps

Safevest deposits

Safevest withdrawals

Safevest Gold purchases

Safevest Gold redemptions

Forgot PIN

Create a frontend recovery flow.

Mock the recovery process.

Do not connect any real OTP service.

The keypad should feel polished and touch-friendly.

19. PROFILE / SETTINGS

Create a Profile screen.

Include:

profile information

phone number

country

verification status

security PIN

notifications

support

privacy

terms

logout

Keep it clean and organized.

20. NOTIFICATIONS

Create a simple notification center.

Use mock notifications such as:

Transfer completed

Wallet funded

Safevest update

Safevest Gold purchase completed

Safevest Gold redemption completed

Gold price update

Security alert

Verification completed

Use read/unread states.

21. SUPPORT

Include a support entry point.

The existing MVP has a floating support/chat concept.

Keep this idea, but redesign it to fit the new UI.

It can open a mock support interface.

Do not connect a real chat backend.

22. STATES & UX

Every major flow must have proper UI states.

Include:

loading

empty

success

error

pending

disabled

validation errors

insufficient balance

insufficient gold holdings

verification required

transaction confirmation

market unavailable mock state

Do not make the prototype feel like a collection of static screens.

Interactions should actually work using frontend state.

For example:

If a mock user sends ₦20,000:

deduct it from the mock balance

create a mock transaction

show success

update dashboard

update transaction history

If a user purchases mock gold:

deduct the selected funding currency

increase the mock gold quantity

update the gold portfolio value

create a Safevest Gold transaction

show success

update dashboard and wallet

If a user redeems mock gold:

deduct the gold quantity

add the mock payout to the selected currency balance

create a redemption transaction

show success

update dashboard and wallet

The same principle should apply to funding, swapping, and Safevest actions.

23. MOCK DATA ARCHITECTURE

Keep all mock data organized separately.

Create something like:

src/data/

with mock data for:

user

wallets

balances

gold holdings

gold prices

transactions

exchange rates

Safevest products

recipients

notifications

Do not scatter fake data throughout components.

Use simple frontend state management.

Keep it easy for a backend developer to replace the mock functions with real API calls later.

24. RESPONSIVE BEHAVIOR

Mobile:

bottom navigation

bottom sheets

full-width cards

touch-first interactions

compact charts

sticky action areas where useful

Tablet:

expanded spacing

two-column layouts where appropriate

Desktop:

spacious dashboard

sidebar/header navigation where appropriate

multi-column cards

larger charts

centered content container

The desktop version should still feel like the same application.

25. PWA

Configure the project as a proper PWA.

Include:

manifest

app name

icons

theme color

installability

service worker

appropriate mobile viewport

offline-friendly app shell

Use the actual CENTE branding for the application icon/favicon where assets are available.

Do not use Lovable branding anywhere.

26. BRANDING

The application should clearly feel like CENTE.

Use the existing CENTE logo/identity where assets are available.

Do NOT invent a different company identity.

Do NOT use Wealth Wallet branding.

Wealth Wallet is only a visual/aesthetic reference for the premium gold/marble wealth-app feeling.

The final application remains CENTE.

27. IMPORTANT SCOPE BOUNDARY

This project is ONLY the CENTE USER APPLICATION.

Do NOT create:

Admin dashboard

Admin login

Admin analytics

Admin user-management tables

Admin KYC review portal

Admin transaction approval system

Admin registration charts

Sproutpay Admin Backoffice

Those belong to a completely separate project/domain.

28. CODE QUALITY

Keep the code:

clean

modular

readable

reusable

production-structured

easy for another developer to continue

Avoid creating unnecessary components for trivial elements.

Use reusable components for:

buttons

cards

inputs

modals

bottom sheets

currency selectors

asset selectors

transaction rows

balance cards

status badges

charts

PIN keypad

gold holding cards

Safevest product cards

29. FINAL EXPECTATION

The result should feel like a real modern CENTE financial/wealth PWA, not a static landing page and not a basic dashboard template.

The existing PHP MVP is only the functional reference.

The new React application should improve:

navigation

information hierarchy

visual polish

mobile usability

transaction flows

wealth/savings presentation

gold investment presentation

feedback states

security interactions

overall consistency

Build the user application as a cohesive product from onboarding → dashboard → wallet → transactions → send money → fund wallet → swaps → Safevest USD → Safevest NGN → Safevest Gold → KYC → security → profile.

Again:

USER APP ONLY.
NO ADMIN.
NO BACKEND.
NO REAL APIs.
MOCK DATA ONLY.
REACT + VITE + PWA.
CENTE branding with the specified gold/marble visual direction.
SAFEVEST GOLD IS AN ACTIVE V1 PRODUCT.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2bcfd45e-1e5a-40b5-8140-074dc5828aa7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
