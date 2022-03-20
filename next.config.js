module.exports = {
  reactStrictMode: false,
  env: {
    project: {
      name: 'pos',
      year: 2022
    },
    company: {
      name: 'pos'
    },
    client: {
      name: 'pos'
    },
    cookie: {
      name: 'pos',
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
  // redirects: async () => {
  //   return [
  //     // {
  //     //   source: '/auth',
  //     //   destination: '/auth',
  //     //   permanent: true,
  //     // },
  //     // {
  //     //     source: '/',
  //     //     destination: '/auth/login', // redirect root '/' path to '/login' path
  //     //     permanent: true,
  //     // },
  //   ]
  // },
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
