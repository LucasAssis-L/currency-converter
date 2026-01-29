export enum ConversionOptionsEnum {
  USD = "USD",
  EUR = "EUR",
  BRL = "BRL",
}

export const currencyPrefixes: Record<ConversionOptionsEnum, string> = {
  [ConversionOptionsEnum.USD]: "$",
  [ConversionOptionsEnum.EUR]: "€",
  [ConversionOptionsEnum.BRL]: "R$",
};