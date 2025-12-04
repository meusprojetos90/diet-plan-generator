/**
 * Price mapping by currency and plan duration
 */

export type Currency = "BRL" | "USD";
export type PlanDuration = "7" | "14" | "30" | "90";

export const PRICES: Record<Currency, Record<PlanDuration, number>> = {
    BRL: {
        "7": 19,
        "14": 29,
        "30": 39,
        "90": 59,
    },
    USD: {
        "7": 9,
        "14": 19,
        "30": 29,
        "90": 39,
    },
};

/**
 * Get price for a specific currency and plan duration
 */
export function getPrice(currency: Currency, days: PlanDuration): number {
    return PRICES[currency][days];
}

/**
 * Get all available plans for a currency
 */
export function getPlansForCurrency(currency: Currency) {
    return Object.entries(PRICES[currency]).map(([days, price]) => ({
        days: parseInt(days),
        price,
        currency,
    }));
}

/**
 * Detect currency from locale
 */
export function getCurrencyFromLocale(locale: string): Currency {
    if (locale.startsWith("pt")) {
        return "BRL";
    }
    return "USD";
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: number, currency: Currency): string {
    if (currency === "BRL") {
        return `R$ ${price.toFixed(2).replace(".", ",")}`;
    }
    return `$${price.toFixed(2)}`;
}
