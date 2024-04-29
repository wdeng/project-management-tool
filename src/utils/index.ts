import * as yaml from 'js-yaml';

export const convertToBase64JPEG = (file: File, maxShorterSide: number = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        let width = image.width;
        let height = image.height;

        // Calculate the scaling factor based on the maxShorterSide
        const scaleFactor = maxShorterSide / Math.min(width, height);

        // Scale down the image dimensions if necessary
        if (scaleFactor < 1) {
          width *= scaleFactor;
          height *= scaleFactor;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(image, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg');
        resolve(base64);
      };
      image.onerror = (error) => {
        reject(error);
      };
      image.src = reader.result as string;
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export const validateYAML = (txt: string) => {
  try {
    return txt && !!yaml.load(txt);
  } catch (error) {
    return false;
  }
}

export function camelToTitle(camelStr: string) {
  return camelStr
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // Add a space before each uppercase letter that follows a lowercase letter or number
    .split(' ')  // Split the string by space
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
    .join(' ');  // Join the words back into a single string
}

export function getExt(filename?: string) {
  if (!filename || filename.indexOf(".") === -1)
    return "";
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

export function createQueryString(params: Record<string, any>) {
  // if not use URLSearchParams, the query string will not be escaped
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query.set(key, value.toString());
    }
  }
  return query.toString();
}

export const languageMap: Record<string, string> = {
  "py": "python",
  "js": "javascript",
  "jsx": "javascript",
  "ts": "typescript",
  "tsx": "typescript",
  "yml": "yaml",
  "": "yaml",
}

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://skapi.wenxiangdeng.com';

export const postReq = async (url: string, data: any = {}, controller?: AbortController) => {
  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-Method': 'POST',
    },
    body: JSON.stringify(data),
    signal: controller?.signal,
  });

  if (!response.ok) {
    console.log(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const getReq = async (url: string) => {
  const response = await fetch(`${API_BASE_URL}/${url}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export function compareObjects(obj1: Object, obj2: Object) {
  const areEqual = Object.values(obj1).every((value, index) => value === Object.values(obj2)[index]);
  return areEqual;
}
