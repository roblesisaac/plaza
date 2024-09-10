import { ref } from 'vue';
import { load } from 'recaptcha-v3';
let public_recaptcha = null;

export default function useApi() {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);

  async function retrievePublicRecaptcha() {
    if (public_recaptcha) return;
    
    public_recaptcha = 'loading...';

    const response = await fetch('/api/auth/recaptcha/public', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }

    const { token } = await response.json();
    public_recaptcha = token;
  }
  

  retrievePublicRecaptcha();

  async function waitForRecaptchaToken() {
    while(!public_recaptcha || public_recaptcha === 'loading...') {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async function request(method, url, body = null, settings = {}) {

    loading.value = true;
    error.value = null;

    try {
      if (settings.checkIfHuman) {
        await waitForRecaptchaToken();
        const recaptcha = await load(public_recaptcha);
        body.recaptchaToken = await recaptcha.execute(settings.action || 'submit');
      }

      const baseUrl = settings.baseUrl || '/api/';

      if (url.startsWith('/')) {
        url = url.slice(1);
      }

      const response = await fetch(baseUrl + url, { 
        method,
        body: body ? JSON.stringify(body) : null,
        headers: {
          'Content-Type': 'application/json',
          ...settings.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || response.statusText || 'API Request Failed');
      }
  
      data.value = await response.json();
  
      return data.value;
    } catch (err) {
      console.error(`Error in useApi.${method}:`, error);
      error.value = err;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    data,
    error,
    loading,
    get: (url, settings) => request('GET', url, null, settings),
    post: (url, body, settings) => request('POST', url, body, settings),
    put: (url, body, settings) => request('PUT', url, body, settings),
    remove: (url, body, settings) => request('DELETE', url, body, settings)
  };
}