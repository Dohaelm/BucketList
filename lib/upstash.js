const baseUrl = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

export async function redisSet(key, value) {
  return fetchWithCheck(`${baseUrl}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(JSON.stringify(value)), // Double stringify for Upstash REST API
  });
}

export async function redisGet(key) {
  const data = await fetchWithCheck(`${baseUrl}/get/${key}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('redisGet data:', data);

  if (!data.result) {
    // Key does not exist or empty
    return null;
  }

  try {
    return JSON.parse(data.result);
  } catch {
    return data.result;
  }
}

export async function redisPushToList(listKey, value) {
  // For Upstash REST API LPUSH, use URL parameters instead of JSON body
  const encodedValue = encodeURIComponent(value);
  return fetchWithCheck(`${baseUrl}/lpush/${listKey}/${encodedValue}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function redisGetList(listKey) {
  const data = await fetchWithCheck(`${baseUrl}/lrange/${listKey}/0/100`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.result || [];
}

async function fetchWithCheck(url, options = {}) {
  try {
    const res = await fetch(url, options);

    // Try parsing the body
    let data;
    try {
      data = await res.json();
      console.log('fetchWithCheck data:', data);
    } catch (jsonErr) {
      throw new Error("Invalid JSON response from Redis.");
    }

    // Handle HTTP errors
    if (!res.ok) {
      throw new Error(data.error || res.statusText);
    }

    return data;

  } catch (err) {
    // Handle network or parsing failure
    throw new Error(`Fetch failed: ${err.message}`);
  }
}