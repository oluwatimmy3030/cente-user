export const user = {
  firstName: "Xential", lastName: "Samuel", country: "Nigeria", countryCode: "+234", phone: "801 234 5678", walletId: "XS-8042-1965",
};

export const initialBalances = { USD: 2840.75, NGN: 1250450 };
export const rates = { NGN_USD: 1548.2 };
export const goldPrice = { NGN: 4927300, USD: 3182.2 };
export const initialGold = { ounces: 0.481, invested: 2080000 };
export const bankAccounts = {
  USD: { bankName: "CENTE Partner Bank", accountName: "CENTE USD Collections", accountNumber: "021000021", currency: "USD" },
  NGN: { bankName: "CENTE Partner Bank", accountName: "CENTE NGN Collections", accountNumber: "8042196501", currency: "NGN" },
};

export const safevestProducts = [
  { id: "USD", name: "Safevest USD", balance: 1800, contributed: 1680, rate: "5.2% p.a. mock", currency: "USD", gain: 120 },
  { id: "NGN", name: "Safevest NGN", balance: 820000, contributed: 760000, rate: "12.5% p.a. mock", currency: "NGN", gain: 60000 },
];

export const initialPlans = [
  { id: "p1", product: "USD", name: "Dollar reserve", amount: 1200, frequency: "Monthly", duration: 6, expectedReturn: 31.2, maturityValue: 1231.2, startDate: "2026-08-15", endDate: "2027-02-15", countdown: "146 days", lock: "Safe Lock", status: "Active" },
  { id: "p2", product: "NGN", name: "December goals", amount: 300000, frequency: "Monthly", duration: 3, expectedReturn: 9375, maturityValue: 309375, startDate: "2026-09-24", endDate: "2026-12-24", countdown: "Starts in 2 days", lock: "Withdraw Anytime", status: "Pending" },
  { id: "p3", product: "GOLD", name: "Gold foundation", amount: 985460, ounces: 0.2, frequency: "One-time", duration: 12, expectedReturn: 68982, maturityValue: 1054442, startDate: "2026-07-01", endDate: "2027-07-01", countdown: "282 days", lock: "Safe Lock", status: "Active" },
];

export const stocks = [
  { symbol: "AAPL", name: "Apple", price: 229.34, change: 1.82 },
  { symbol: "MSFT", name: "Microsoft", price: 517.42, change: 0.64 },
  { symbol: "NVDA", name: "NVIDIA", price: 184.91, change: 2.31 },
  { symbol: "GTCO", name: "Guaranty Trust Holding", price: 92.4, change: -0.75, currency: "NGN" },
];
export const holdings = [
  { symbol: "AAPL", shares: 3.2, value: 733.89, return: 74.2 },
  { symbol: "MSFT", shares: 1.1, value: 569.16, return: 41.7 },
];
export const shareOrders = [
  { id: "o1", symbol: "AAPL", side: "Buy", shares: 1.2, total: 275.21, status: "Completed", date: "18 Sep, 11:20" },
  { id: "o2", symbol: "NVDA", side: "Buy", shares: 2, total: 369.82, status: "Pending", date: "Today, 09:40" },
];

export const initialTransactions = [
  { id: "t1", title: "Safevest Gold purchase", subtitle: "0.167 OZ at a mock market price", amount: -820768, currency: "NGN", category: "Gold", status: "Completed", date: "Today, 10:42", quantity: 0.167, pricePerOunce: 4914778, fee: 2500 },
  { id: "t2", title: "Wallet funded", subtitle: "Bank transfer", amount: 250000, currency: "NGN", category: "Money In", status: "Completed", date: "Yesterday, 16:18" },
  { id: "t3", title: "Sent to Ada Okafor", subtitle: "Local bank transfer", amount: -45000, currency: "NGN", category: "Money Out", status: "Completed", date: "18 Sep, 09:30", fee: 50 },
  { id: "t4", title: "USD wallet funded", subtitle: "USD bank transfer", amount: 300, currency: "USD", category: "Money In", status: "Completed", date: "17 Sep, 14:05", fee: 0 },
  { id: "t5", title: "Safevest USD deposit", subtitle: "Dollar reserve plan", amount: -500, currency: "USD", category: "Wealth", status: "Completed", date: "15 Sep, 08:20", fee: 0 },
];

export const initialNotifications = [
  { id: "n1", title: "Gold purchase completed", body: "0.167 OZ has been added to your Safevest Gold holding.", time: "12 min", read: false },
  { id: "n2", title: "Wallet funded", body: "Your NGN wallet received ₦250,000.", time: "1 day", read: false },
  { id: "n3", title: "Verification completed", body: "Your CENTE profile is now verified.", time: "3 days", read: true },
];
export const chartSeries = [22, 25, 24, 29, 31, 34, 33, 38, 41, 43, 47, 52];
export const currencySymbol = (currency) => ({ NGN: "₦", USD: "$", GOLD: "₦" })[currency] ?? "";
export const formatMoney = (value, currency = "NGN") => `${currencySymbol(currency)}${Math.abs(Number(value) || 0).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const formatOunces = (value) => `${Number(value || 0).toFixed(3)} OZ`;
