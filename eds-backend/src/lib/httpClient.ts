import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

//define error codes to handle
const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

//define class with base url, timeout and retry
class HttpClient {
  private client: AxiosInstance;
  private maxRetries: number;

  constructor(baseURL: string, timeout = 5000, maxRetries = 3) {
    this.maxRetries = maxRetries;
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  //define retry failure
  private isRetryable(error: AxiosError): boolean {
    if (error.response) {
      return RETRY_STATUS_CODES.includes(error.response.status);
    }
    // Network or timeout errors
    return error.code === "ECONNABORTED" || !error.response;
  }

  //define request with autoretry
  private async requestWithRetry<T>(
    config: AxiosRequestConfig,
    retriesLeft?: number
  ): Promise<T> {
    const attempts = retriesLeft ?? this.maxRetries;

    try {
      const response = await this.client.request<T>(config);
      return response.data;
    } catch (error: any) {
      if (this.isRetryable(error) && attempts > 0) {
        console.warn(
          `Retrying request ${config.url}, attempts left: ${attempts - 1}`
        );
        // deduct try attempt until max
        return this.requestWithRetry<T>(config, attempts - 1);
      }
      console.error(
        "HTTP Request Failed:",
        error.message,
        error.response?.data || ""
      );
      throw error;
    }
  }

  //helper get
  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "GET", url });
  }

  //helper post
  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.requestWithRetry<T>({ ...config, method: "POST", url, data });
  }
}

//export single httpclient with baseurl
const httpClient = new HttpClient(process.env.EXTERNAL_API_URL || "");
export default httpClient;
