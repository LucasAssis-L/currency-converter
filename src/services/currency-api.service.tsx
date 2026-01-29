import CurrencyApiBaseService from "./service-client";

class CurrencyApiService {
  private currencyApi: CurrencyApiBaseService;

  constructor(apiKey: string){
    this.currencyApi = CurrencyApiBaseService.getInstance(apiKey);
  }

  async getCurrencies(codes?: string[]){
    const response = await this.currencyApi.getCurrencies(codes);
    return response;
  }

  async convertCurrency(amount: number, fromCurrency: string, toCurrency: string){
    const response = await this.currencyApi.convertCurrency(amount, fromCurrency, toCurrency);
    return response;
  }

  async historicalConversion(amountToConvert: number, date: string, baseCurrency: string, currencies: string[]){
    const response = await this.currencyApi.historicalConversion(amountToConvert, date, baseCurrency, currencies);
    return response;
  }
}

export default CurrencyApiService;