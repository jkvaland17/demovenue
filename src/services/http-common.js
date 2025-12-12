import axios from "axios";
export const BASEURL = {
  ENDPOINT_URL: process.env.NEXT_PUBLIC_API_ENDPOINT,
};
export default axios.create({
  baseURL: `${BASEURL.ENDPOINT_URL}/api/`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
  },
});
// console.log(sessionStorage.getItem("token"));
// http://15.206.201.40:5100
// https://blockchainapi.demotcpdigital.com
// http://localhost:5100
