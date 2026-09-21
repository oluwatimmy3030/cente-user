export const user = {
  firstName: "Xential",
  lastName: "Samuel",
  country: "Nigeria",
  countryCode: "+234",
  phone: "801 234 5678",
  walletId: "XS-8042-1965",
};

export const initialBalances = {
  NGN: 1250450,
  USD: 2840.75,
  USDT: 1420.32,
  GOLD: 2369400,
};

export const rates = { NGN_USD: 1548.2, NGN_USDT: 1561.4, USD_USDT: 1.008 };
export const goldPrice = { NGN: 158420, USD: 102.32 };
export const initialGold = { grams: 14.956, invested: 2080000 };

export const safevestProducts = [
  { id: "USD", name: "Safevest USD", balance: 1800, contributed: 1680, rate: "Up to 5.2% p.a.", currency: "USD", gain: 120 },
  { id: "NGN", name: "Safevest NGN", balance: 820000, contributed: 760000, rate: "Up to 12.5% p.a.", currency: "NGN", gain: 60000 },
];

export const recipients = [
  { id: "r1", name: "Ada Okafor", detail: "CENTE · •• 4821", initials: "AO" },
  { id: "r2", name: "David Mensah", detail: "CENTE · •• 2074", initials: "DM" },
];

export const initialTransactions = [
  { id: "t1", title: "Safevest Gold purchase", subtitle: "5.2g at ₦157,840/g", amount: -820768, currency: "NGN", category: "Gold", status: "Completed", date: "Today, 10:42", quantity: 5.2, pricePerGram: 157840, fee: 2500 },
  { id: "t2", title: "Wallet funded", subtitle: "Bank transfer", amount: 250000, currency: "NGN", category: "Money In", status: "Completed", date: "Yesterday, 16:18" },
  { id: "t3", title: "Sent to Ada Okafor", subtitle: "CENTE transfer", amount: -45000, currency: "NGN", category: "Money Out", status: "Completed", date: "18 Sep, 09:30", fee: 50 },
  { id: "t4", title: "USD swap", subtitle: "NGN to USD", amount: 300, currency: "USD", category: "Swaps", status: "Completed", date: "17 Sep, 14:05", fee: 1.5 },
];

export const initialNotifications = [
  { id: "n1", title: "Gold purchase completed", body: "5.2g has been added to your Safevest Gold holding.", time: "12 min", read: false },
  { id: "n2", title: "Wallet funded", body: "Your NGN wallet received ₦250,000.", time: "1 day", read: false },
  { id: "n3", title: "Verification completed", body: "Your CENTE profile is now verified.", time: "3 days", read: true },
];

export const chartSeries = [22, 25, 24, 29, 31, 34, 33, 38, 41, 43, 47, 52];

export const currencySymbol = (currency) => ({ NGN: "₦", USD: "$", USDT: "₮", GOLD: "₦" })[currency];

export const formatMoney = (value, currency = "NGN") =>
  `${currencySymbol(currency)}${Math.abs(value).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
