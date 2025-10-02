import axios from "axios";
import { SERVER_URL } from "@/app/config";

export const api = axios.create({
  baseURL: SERVER_URL,
});
