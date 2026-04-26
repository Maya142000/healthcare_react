import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_AI_BACKEND,
});
console.log("....api....",api)

export default api;
