const BASE_URL = 'http://localhost:8500';

const api = {
    Auth: {
        login:    (data) => axios.post(`${BASE_URL}/auth/login`, data),
        register: (data) => axios.post(`${BASE_URL}/auth/register`, data),
        getUsers: ()     => axios.get(`${BASE_URL}/auth/users`)
    },
    Products: {
        getAll:   ()     => axios.get(`${BASE_URL}/products`),
        getById:  (id)   => axios.get(`${BASE_URL}/products/${id}`),
        create:   (data) => axios.post(`${BASE_URL}/products`, data),
        update:   (id, data) => axios.put(`${BASE_URL}/products/${id}`, data),
        remove:   (id)   => axios.delete(`${BASE_URL}/products/${id}`)
    },
    Inventory: {
        getAllLogs:        ()     => axios.get(`${BASE_URL}/inventory/logs`),
        getDailySummary:   ()     => axios.get(`${BASE_URL}/inventory/summary`),
        adjustStock:       (data) => axios.post(`${BASE_URL}/inventory/adjust`, data),
        saveDailySummary:  ()     => axios.post(`${BASE_URL}/inventory/summary/save`, {}),
        getSummaryHistory: ()     => axios.get(`${BASE_URL}/inventory/summary/history`)
    }
};
