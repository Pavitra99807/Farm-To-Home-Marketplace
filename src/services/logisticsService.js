import axios from "axios";

export const calculateLogistics = async (payload) => {
  const res = await axios.post(
    "http://localhost:8050/api/logistics/calculate-total",
    payload
  );

  return res.data.data;
};