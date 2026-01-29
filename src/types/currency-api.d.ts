declare module '@everapi/currencyapi-js' {
  export interface Currency {
    symbol: string;
    name: string;
    symbol_native: string;
    decimal_digits: number;
    rounding: number;
    code: string;
    name_plural: string;
  }
  
  export interface CurrenciesResponse {
    data: {
      [key: string]: Currency;
    };
  }
  
  export interface RateData {
    code: string;
    value: number;
  }
  
  export interface LatestRatesResponse {
    data: {
      [key: string]: RateData;
    };
  }

  export interface HistoricalRatesResponse {
    data: {
      [key: string]: RateData;
    };
  }
  
  export interface CurrenciesParams {
    currencies?: string[];
  }
  
  export interface LatestRatesParams {
    base_currency?: string;
    currencies?: string[];
  }

  export interface HistoricalRatesParams {
    date: string;
    base_currency?: string;
    currencies?: string[];
  }
  
  export default class CurrencyAPI {
    constructor(apiKey: string);
    currencies(params?: CurrenciesParams): Promise<CurrenciesResponse>;
    latest(params?: LatestRatesParams): Promise<LatestRatesResponse>;
    historical(params?: HistoricalRatesParams): Promise<HistoricalRatesResponse>;
  }
}