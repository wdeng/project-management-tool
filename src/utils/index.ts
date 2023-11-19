import axios from 'axios';

export function camelToTitle(camelStr: string) {
  return camelStr
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // Add a space before each uppercase letter that follows a lowercase letter or number
    .split(' ')  // Split the string by space
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
    .join(' ');  // Join the words back into a single string
}

export function getFileExtension(filename: string) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export const languageMap: Record<string, string> = {
  "py": "python",
  "js": "javascript",
  "jsx": "javascript",
  "ts": "typescript",
  "tsx": "typescript",
}

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://skapi.wenxiangdeng.com';

export const postReq = async (url: string, data: any = undefined) => {
  const response = await axios.post<any>(`${API_BASE_URL}/${url}`, data, { withCredentials: true });
  return response.data;
}

export const getReq = async (url: string) => {
  const response = await axios.get<any>(`${API_BASE_URL}/${url}`, { withCredentials: true });
  return response.data;
}