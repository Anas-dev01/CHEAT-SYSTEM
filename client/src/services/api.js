import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api'});
api.interceptors.request.use(c=>{const t=localStorage.getItem('token');if(t)c.headers.Authorization=`Bearer ${t}`;return c});
api.interceptors.response.use(r=>r,e=>{if(!e.config?.skipErrorPopup&&e.response?.status!==401)window.dispatchEvent(new CustomEvent('app-error',{detail:e.response?.data?.message||'Something went wrong. Please try again.'}));return Promise.reject(e)});
export default api;
