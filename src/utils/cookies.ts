// utils/cookieUtils.ts

export const setCookie = (name: string, value: string, days: number = 7): void => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;Secure;SameSite=Lax`;
  };
  
  export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for (let cookie of cookiesArray) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
    return null;
  };
  
  export const deleteCookie = (name: string): void => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; Secure; SameSite=Lax`;
  };
  