import axios from "axios";
import { STRAVA_API_ENDPOINT } from "./constants";

const API = axios.create({
  baseURL: STRAVA_API_ENDPOINT,
});

export default API;