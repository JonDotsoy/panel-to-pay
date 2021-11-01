type locale = string
type currency = string

type numberFormatCache = Map<currency, Intl.NumberFormat>

const selectLocaleCache = new Map<locale, numberFormatCache>();
const selectLocale = (locale: string) => {
  const numberFormatCache = selectLocaleCache.get(locale);

  if (!numberFormatCache) {
    const newNumberFormatCache: numberFormatCache = new Map<currency, Intl.NumberFormat>();
    selectLocaleCache.set(locale, newNumberFormatCache);
    return newNumberFormatCache;
  }

  return numberFormatCache;
}

export const selectNumberFormat = (locale: locale, currency: currency) => {
  const numberFormatCache = selectLocale(locale);
  const numberFormat = numberFormatCache.get(currency)

  if (!numberFormat) {
    const newNumberFormat = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'name',
    })

    numberFormatCache.set(currency, newNumberFormat);

    return newNumberFormat;
  }

  return numberFormat;
}