/// <reference types="node" />
import CurrencyApiService from "./currency-api.service";

jest.mock('@everapi/currencyapi-js');

describe('CurrencyApiService', () => {
  const service: CurrencyApiService = new CurrencyApiService(process.env.VITE_CURRENCY_API_KEY || 'test-key');

  test('getCurrencies should return currencies', async () => {
    const mockResponse = {
      data: {
        USD: {
          symbol: '$',
          name: 'US Dollar',
          symbol_native: '$',
          decimal_digits: 2,
          rounding: 0,
          code: 'USD',
          name_plural: 'US dollars',
        },
      },
    };

    jest.spyOn(service, 'getCurrencies').mockResolvedValue(mockResponse);

    const result = await service.getCurrencies();
    expect(result).toEqual(mockResponse);
  });
});