// import CurrencyAPI from '../../src/types/currency-api';
import CurrencyAPI, { type HistoricalRatesParams } from '@everapi/currencyapi-js';
import type { CurrenciesResponseModel } from '../data/currencies-response.model';
import type { LatestRatesResponseModel } from '../data/latest-rate-response.model';

class CurrencyApiBaseService {
  private client: CurrencyAPI;
  private static instance: CurrencyApiBaseService;

  private constructor(apiKey: string) {
    this.client = new CurrencyAPI(apiKey);
  }

  // Singleton pattern to ensure single instance
  public static getInstance(apiKey: string): CurrencyApiBaseService {
    if (!CurrencyApiBaseService.instance) {
      CurrencyApiBaseService.instance = new CurrencyApiBaseService(apiKey);
    }
    return CurrencyApiBaseService.instance;
  }

  /* Fetch all available currencies */
  async getCurrencies(codes?: string[]): Promise<CurrenciesResponseModel> {
    try {
      const response = await this.client.currencies(
        codes ? { currencies: codes } : undefined
      );
      return response;
    } catch (error) {
      throw new Error(
        `Failed to fetch currencies: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /* Get latest exchange rates */
  async getLatestRates(
    baseCurrency: string = 'USD',
    targetCurrencies?: string[]
  ): Promise<LatestRatesResponseModel> {
    try {
      const response = await this.client.latest({
        base_currency: baseCurrency,
        ...(targetCurrencies && { currencies: targetCurrencies }),
      });
      return response;
    } catch (error) {
      throw new Error(
        `Failed to fetch rates: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /* Convert amount from one currency to another */
  async convertCurrency(
    amount: number,
    fromCurrency: string,
    toCurrency: string
  ): Promise<number> {
    try {
      const rates = await this.getLatestRates(fromCurrency, [toCurrency]);
      const rate = rates.data[toCurrency]?.value;
      
      if (!rate) {
        throw new Error(`Rate not found for ${toCurrency}`);
      }
      
      return amount * rate;
    } catch (error) {
      throw new Error(
        `Failed to convert currency: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async historicalConversion(amountToConvert: number, date: string, base_currency: string, currencies: string[]){
    try{
      const params = {
        date,
        base_currency,
        currencies
      } as HistoricalRatesParams;

      const response = await this.client.historical(params);
      const rate = response.data[currencies[0]]?.value;
      
      if (!rate) {
        throw new Error(`Rate not found for ${currencies[0]}`);
      }
      
      return amountToConvert * rate;

    } catch(error){
      throw new Error(
        `Failed to convert currency: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}

export default CurrencyApiBaseService;