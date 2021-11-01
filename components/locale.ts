import { createContext, createElement, FC, useContext } from "react";

interface LocaleContext {
  locale: string;
}

export const localeContext = createContext<LocaleContext>({
  locale: 'es-CL',
});

export const LocaleProvider: FC = ({ children }) => {
  const InitialLocale: LocaleContext = {
    locale: 'es-CL',
  }

  return createElement(localeContext.Provider, { value: InitialLocale, children });
}

export const useLocale = () => useContext(localeContext).locale;
