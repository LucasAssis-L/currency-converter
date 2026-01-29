export interface LatestRatesResponseModel {
  data: {
    [key: string]: {
      code: string;
      value: number;
    };
  };
}