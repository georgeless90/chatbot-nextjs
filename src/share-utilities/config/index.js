const api = {
    apiPort: process.env.NEXT_PUBLIC_API_PORT || 8080,
    apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN || `http://localhost:`,
    apiUrl: process.env.NEXT_PUBLIC_API_URL || `/api`
}

export default {
    api
}