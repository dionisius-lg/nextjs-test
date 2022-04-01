module.exports = {
  reactStrictMode: false,
  env: {
    project: {
      name: 'nextjs-test',
      year: 2022
    },
    company: {
      name: 'nextjs-test'
    },
    client: {
      name: 'nextjs-test'
    },
    cookie: {
      name: 'nextjs-test',
      password: '2gyZ3GDw3LHZQKDhPmPDL3sjREVRXPr8'
    },
    api: {
      // baseURL: 'http://localhost:8000'
      baseURL: 'http://localhost/slimphp-api'
    }
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
}
