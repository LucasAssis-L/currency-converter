import type { CurrencyModel } from "./currency.model";

export interface CurrenciesResponseModel {
  data: {
    [key: string]: CurrencyModel;
  };
}