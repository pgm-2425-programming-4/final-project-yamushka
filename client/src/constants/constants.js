export const API_URL = import.meta.env.PROD
  ? "https://jammin-playground.onrender.com/api"
  : "http://localhost:1337/api";

export const API_TOKEN = import.meta.env.PROD
  ? "PROD token"
  : "85b2e7950e6d86b68e4f1e2d87f884a5906ebcdfd067643140637170d6a5dc6cd6ff6a7114b938a50bd6b73083c8f8c2774c2fb4b67276cf65d3a2c5ab85e9b14cb49a1daa24d7c8056905f0bf5929d7b97fb48e9692f8e887bcdfff39455b63a4f8e25329a2b80ef9dfabfc28d416bd04acc1cb792bfd976a2fb2238716e9f8";
