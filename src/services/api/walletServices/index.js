import { fetchCall } from '../../endpoints';
import config from '../../../constants/config.json';

// Service Base Url
const SERVICE_BASE_URL = '/wallet';

// Creating new wallet
const createNewWallet = (data)=>
    fetchCall(
        `${SERVICE_BASE_URL}/createWallet`,
        config?.requestMethod['POST'],
        data,
        true
    );

// Fetching wallet of user
const getUserWallet = (id)=>
    fetchCall(
        `${SERVICE_BASE_URL}/getWalletByUser/${id}`,
        config?.requestMethod['GET'],
        {},
        true
    );

// Fetching wallet of user
const updateWalletCredits = (id, data)=>
    fetchCall(
        `${SERVICE_BASE_URL}/updateWallet/${id}`,
        config?.requestMethod['PUT'],
        data,
        true
    );

export const walletServices = {
    createNewWallet,
    getUserWallet,
    updateWalletCredits
}