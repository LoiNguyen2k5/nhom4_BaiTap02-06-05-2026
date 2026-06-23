import axiosClient from './axiosClient';

export const getJobPostings = () => axiosClient.get('/recruitment/job-postings').then((r) => r.data);

export const getJobPostingById = (id) =>
  axiosClient.get(`/recruitment/job-postings/${id}`).then((r) => r.data);

export const createJobPosting = (data) =>
  axiosClient.post('/recruitment/job-postings', data).then((r) => r.data);

export const updateJobPosting = (id, data) =>
  axiosClient.put(`/recruitment/job-postings/${id}`, data).then((r) => r.data);

export const deleteJobPosting = (id) =>
  axiosClient.delete(`/recruitment/job-postings/${id}`).then((r) => r.data);
