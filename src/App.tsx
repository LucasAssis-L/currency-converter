import type { Currency } from "@everapi/currencyapi-js";
import "./App.scss";
import { ConversionOptionsEnum } from "./data/conversion/conversion-options.model";
import CurrencyApiService from "./services/currency-api.service";
import "./theme/reset.scss";
import { useEffect, useState } from "react";
import { parseNumber } from "./helpers/input-mask";

function App() {
  const currencyApiService = new CurrencyApiService(import.meta.env.VITE_CURRENCY_API_KEY || '');

  const [currencyOptions, setCurrencyOptions] = useState<Currency[]>([]);

  const [currencyToConvert, setCurrencyToConvert] = useState<Currency>();
  const [valueToConvert, setValueToConvert] = useState<number>(0);

  const [convertedCurrency, setConvertedCurrency] = useState<Currency>();
  const [convertedValue, setConvertedValue] = useState<number>(0);

  const [conversionDate, setConversionDate] = useState<string>("");

  async function getCurrencies(codes?: string[]): Promise<void>{
    const response = await currencyApiService.getCurrencies(codes);

    if(response?.data){
      setCurrencyOptions(Object.values(response.data));

      const firstCurrency = Object.values(response.data).find(p => p.code === ConversionOptionsEnum.USD);
      
      if(firstCurrency){
        setCurrencyToConvert(firstCurrency);
      } else {
        setCurrencyToConvert(Object.values(response.data)[0]);
      }

      const secondCurrency = Object.values(response.data).find(p => p.code === ConversionOptionsEnum.BRL);
      
      if(secondCurrency){
        setConvertedCurrency(secondCurrency);
      } else {
        setConvertedCurrency(Object.values(response.data)[0]);
      }
    }
  }

  async function convertCurrency(): Promise<void>{
    const response = await currencyApiService.convertCurrency(valueToConvert, currencyToConvert!.code, convertedCurrency!.code);

    if(response){
      setConvertedValue(response);
    }
  }

  async function historicalConversion(): Promise<void>{
    const response = await currencyApiService.historicalConversion(valueToConvert, conversionDate, currencyToConvert!.code, [convertedCurrency!.code]);

    if(response){
      setConvertedValue(response);
    }
  }

  async function setFormDate(){
    const today = new Date();
    today.setDate(today.getDate() - 1);
    const dateString = today.toISOString().split("T")[0];

    setConversionDate(dateString);
  }

  useEffect(() => {
    (async () => {
      await setFormDate();
      // await getCurrencies();
    })();
  }, []);

  const handleChange = (value: string) => {
    return parseNumber(value);
  };

  async function swapValues(){
    const tempCurrencyToConvert = currencyToConvert;
    const tempValueToConvert = valueToConvert;
    
    setCurrencyToConvert(convertedCurrency);
    setConvertedCurrency(tempCurrencyToConvert);

    setValueToConvert(convertedValue);
    setConvertedValue(tempValueToConvert);
  }

  return (
    <>
      <section className="container title-container">
        <h1>Currency Converter</h1>
      </section>

      <section className="container conversion-container">
        <form action="">
          <div className="input-card card-from">
            <label htmlFor="fromAmount">From</label>

            <div className="d-flex">
              <select
                name="originalCurrency"
                id="originalCurrency"
                value={currencyToConvert?.code}
                onChange={(opt) => {
                  setCurrencyToConvert(currencyOptions.find(c => c.code === opt.target.value));
                }}>
                {currencyOptions.map((currency, index) => (
                  <option key={index} value={currency.code}>{`${currency.code} (${currency.symbol})`}</option>
                ))}
              </select>

              <input
                type="number"
                id="fromAmount"
                name="fromAmount"
                placeholder="Value to convert"
                inputMode="decimal"
                required
                value={valueToConvert}
                onChange={(e) => {
                  setValueToConvert(Number(e.target.value));
                }}
              />
            </div>
          </div>

          <section className="handler-section">
            <div className="actions">
              <div className="input-group">
                <label htmlFor="conversionDate">Conversion Date</label>
                <input
                  type="date"
                  name="conversionDate"
                  id="conversionDate"
                  value={conversionDate}
                  onChange={(e) => setConversionDate(e.target.value)} />
              </div>
            
              <button
                type="button"
                className="d-block btn-convert"
                onClick={() => { swapValues() }}
              >
                🔃 Swap
              </button>

              <button
                type="button"
                className="d-block btn-convert"
                onClick={() => {
                  if(conversionDate){
                    historicalConversion()
                  } else{
                    convertCurrency()
                  }
                }}
              >
                ✅ Convert
              </button>

              <button
                type="button"
                className="d-block btn-convert"
                onClick={() => { getCurrencies() }}
              >
                Get Currencies
              </button>
            </div>
          </section>

          <div className="input-card card-to">
            <label htmlFor="toAmount">To</label>

            <div className="d-flex">
              <select
                name="convertedCurrency"
                id="convertedCurrency"
                value={convertedCurrency?.code}
                onChange={(opt) => {
                  setConvertedCurrency(currencyOptions.find(c => c.code === opt.target.value));
                  setConvertedValue(0);
                }}>
                {currencyOptions.map((currency, index) => (
                  <option
                    key={index}
                    value={currency.code}
                  >
                    {`${currency.code} (${currency.symbol})`}
                  </option>
                ))}
              </select>

              <input
                type="number"
                id="toAmount"
                name="toAmount"
                placeholder="Converted value"
                inputMode="decimal"
                required
                disabled
                value={convertedValue.toFixed(2)}
                onChange={(e) => {
                  setConvertedValue(handleChange(e.target.value));
                }}
              />
            </div>
          </div>
        </form>
      </section>

      <section className="container message-container">
        <h3>Currency Converter</h3>
        <span>Value Converted.</span>
      </section>
    </>
  );
}

export default App;
