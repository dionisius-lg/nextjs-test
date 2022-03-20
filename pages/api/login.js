import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { restApi } from "lib/restApi";

export default withIronSessionApiRoute(async (req, res) => {
    const data = await req.body;

    // const reqLogin = await restApi({ req, res, method: 'POST', endpoint: '/auth/login', data })
    const reqLogin = await restApi({ req, res, method: 'POST', endpoint: '/token', data })

    if (reqLogin) {
        if (reqLogin.response_code === 200) {
            console.log('reqLogin', reqLogin)
            let user = {
                isLoggedIn: true,
                login: "dion",
                avatarUrl: "https://avatars.githubusercontent.com/u/59903109?v=4",
                token: reqLogin.data.token,
                refreshToken: reqLogin.data.refresh_token,
                data: {
                    id: reqLogin.data.id
                }
            }

            req.session.user = user;
            await req.session.save();

            const reqUser = await restApi({ req, res, method: 'GET', endpoint: `/users/${user.data.id}` })

            if (reqUser.response_code === 200) {
                user.data = reqUser.data
                req.session.user = user;
                await req.session.save();
                return res.json(user);
            }

            req.session.destroy();
            return res.status(reqUser.response_code).json(reqUser);
        }

        return res.status(reqLogin.response_code).json(reqLogin);
    }

    return res.status(403).json({
        message: "Forbidden"
    })
}, sessionOptions);
