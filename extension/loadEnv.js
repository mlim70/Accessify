async function loadEnv() {
  console.log('Loading environment variables');
  try {
    const response = await fetch(chrome.runtime.getURL('.env'));
    if (!response.ok) {
      throw new Error(`Failed to fetch .env file: ${response.statusText}`);
    }
    const text = await response.text();
    console.log('.env file content:', text);
    const env = {};
    text.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim();
      }
    });
    console.log('Parsed environment variables:', env);
    return env;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    throw error;
  }
}