//  # Configuração do Axios

import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://randomuser.me/api/',
    timeout: 10000,
});

export default apiClient;
