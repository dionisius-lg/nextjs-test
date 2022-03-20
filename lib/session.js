// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
export const sessionOptions = {
    password: process.env.cookie.password,
    cookieName: process.env.cookie.name,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production' ? true : false
    },
};
