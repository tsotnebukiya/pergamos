import axios from "axios";

export const exchangeRate = async (amount: number, currency: string) => {
  let usdAmount: number;
  try {
    const response = await axios.get(
      `http://api.exchangeratesapi.io/v1/latest?access_key=5212a12f069f199514324fd88ca2b74a&cbase=USD&symbols=USD,${currency.toUpperCase()}`
    );
    if (currency === "eur") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      usdAmount = amount * response.data.rates.USD;
    } else {
      usdAmount =
        (amount /
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          response.data.rates[currency.toUpperCase()]) *
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        response.data.rates.USD;
    }
    return usdAmount;
  } catch (err) {
    throw new Error("Error fetching exchange rate");
  }
};
