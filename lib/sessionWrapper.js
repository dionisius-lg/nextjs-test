import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";

const sessionOptions = {
    password: process.env.cookie.password,
    cookieName: process.env.cookie.name,
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production' ? true : false
    },
};

export function withSessionRoute(handler) {
    return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr(handler) {
    return withIronSessionSsr(handler, sessionOptions);
}