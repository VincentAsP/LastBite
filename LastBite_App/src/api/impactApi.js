import apiClient from './apiClient';

export const getUserEcoImpact = async (userID) => {
    const { data } = await apiClient.get(`/impact/${userID}`);
    return data;
};

export const getMyPoints = async (userID) => {
    const { data } = await apiClient.get(`/users/points/${userID}`);
    return data;
};