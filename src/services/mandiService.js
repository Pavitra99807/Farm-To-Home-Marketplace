import axios from "axios";

export const getKarnatakaMandiPrices = async () => {
  const response = await axios.get(
    "http://localhost:8050/api/mandi/live"
  );

  return response.data;
};