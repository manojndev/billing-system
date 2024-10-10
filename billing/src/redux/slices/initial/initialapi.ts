import axios from 'axios';
export const fetchWelcomeApi = async () => {
    const apiConfig = {
        headers: {
        },
        data: {
        },
    };
    const response = await axios.post("https://www.iana.org/help/example-domains", apiConfig);
    return response;
};
