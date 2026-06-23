import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const publicApi = axios.create({ baseURL: `${BASE_URL}/api/public` });

export const getPublicJobs = () => publicApi.get('/jobs').then((r) => r.data);

export const getPublicJobById = (id) => publicApi.get(`/jobs/${id}`).then((r) => r.data);

export const applyToJob = (id, formData) =>
  publicApi.post(`/jobs/${id}/apply`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
