import axios, { AxiosRequestConfig, Method } from 'axios';

class Utils {
    static async httpRequest(
        url: string,
        method: Method = 'get',
        headers: Record<string, string> = {},
        params: Record<string, any> = {},
        data: Record<string, any> = {},
        config: AxiosRequestConfig = {}
    ): Promise<any> {
        try {
            const options: AxiosRequestConfig = {
                method,
                url,
                headers,
                params,
                data,
                ...config,
            };
            const response = await axios(options);
            return response.data;
        } catch (error) {
            console.error('请求出错lelele:', error);
            throw error;
        }
    }

    static async getNonce(url: string, walletAddress: string) {
        const resp = await axios.post(url, { address: walletAddress })
        return resp.data
    }

    static async userLogin(url: string, loginType: string, address: string, message: string, signature: string, nonce: string) {
        const resp = await axios.post(url, { loginType, address, message, signature, nonce })
        return resp.data
    }

    static async getEmailCode(url: string, email: string) {
        const resp = await axios.post(url, { email })
        return resp.data
    }

    static decodeBase64(base64: string) {
        const binaryString = atob(base64);
        const decoder = new TextDecoder('utf-8');
        const decodedString = decoder.decode(new Uint8Array([...binaryString].map(char => char.charCodeAt(0))));
        return decodedString;
    }

    static formatJson(jsonString: string) {
        const jsonObject = JSON.parse(jsonString);
        return JSON.stringify(jsonObject, null, 2)
    }
}

export default Utils;
