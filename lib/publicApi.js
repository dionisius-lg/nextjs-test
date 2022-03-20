import axios from "axios";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";


const userSession = async (req, res, withSession) => {
    const user = await req.session.user;

    if (user === undefined) {
        return false
    }

    return user
};

const publicApi = async ({ req, res, method, endpoint, data = {} }) => {
    const optMethod = method.toString().toLowerCase() || 'get'
    const user = await userSession(req, res);
    console.log(user, 'asd')
    let result = {}

    axios.defaults.baseURL = process.env.api.baseURL || 'http://localhost:8000'
    axios.defaults.withCredentials = true
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

    // console.log(`Bearer ${user?.token || ''}`, 'asdasd')
    // if (endpoint !== '/login') {
    //     axios.defaults.headers.common = {
    //         'Authorization': `Bearer ${user?.token || ''}`
    //     }
    // }

    switch (optMethod) {
        case 'post':
            result = await axios.post(endpoint, data).catch(errorResponse)
            break
        case 'put':
            result = await axios.put(endpoint, data).catch(errorResponse)
            break
        case 'delete':
            result = await axios.delete(endpoint).catch(errorResponse)
            break
        default:
            result = await axios.get(endpoint).catch(errorResponse)
            break
    }

    return result.data
}

const errorResponse = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        return error.response;
    }

    let data = {
        // request_time: 0,
        request_time: new Date().getTime(),
        response_code: 503,
        success: false,
        message: 'Service Unavailable'
    }

    return { data }
}

// export const getServerSideProps = async () => {
//     const token = await fetchData();

//     return {
//       token: token,
//     };
// }

export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get("user");

    if (user === undefined) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return { props: { user: null } };
    }

    return {
        props: { user: req.session.get("user") }
    };
});

export default publicApi