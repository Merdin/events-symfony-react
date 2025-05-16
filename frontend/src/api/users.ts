import { apiClient } from './client';

export const getUsers = async () => {
  const { data } = await apiClient.get('/users');
  return data['member'];
};

export const getUserById = async (id: string | number) => {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
};

export const makeEmployee = async (id: string | number) => {
    const { data } = await apiClient.post(`/users/${id}/roles/employee`);
    return data;
};

export const removeEmployee = async (id: string | number) => {
    const { data } = await apiClient.delete(`/users/${id}/roles/employee`);
    return data;
};
