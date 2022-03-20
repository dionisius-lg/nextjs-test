import { useState, useEffect, useContext } from "react";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";

import { isEmptyValue } from "utils/general";
import Pagination from "components/Pagination";
import fetchJson, { FetchError } from "lib/fetchJson";
// import useSWR, { mutate, trigger } from "swr";

import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import MainLayout from "components/layouts/MainLayout";
import { useRouter } from "next/router";

import useUser from "lib/useUser";
import useEvents from "lib/useEvents";

import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

if (typeof Highcharts === 'object') {
    HighchartsExporting(Highcharts)
}

const initialNotif = {
    title: "",
    message: "",
    show: false,
    type: null
}

const initialModal = {
    show: false,
    dataId: null
}

export default function Users({ calls, call_statuses, user }) {
    // const fnDepartments = useDepartments()
    // const fnUserLevels = useUserLevels()
    // const fnUsers = useUsers()
    // const { Error, Success, Warning } = Notification

    const [loading, setLoading] = useState(true)
    const [notif, setNotif] = useState(initialNotif)
    const [tableData, setTableData] = useState({})
    // const [modalAdd, setModalAdd] = useState(initialModal)
    // const [modalDetail, setModalDetail] = useState(initialModal)
    const [formFilter, setFormFilter] = useState({
        username: "",
        email: "",
        // user_level_id: ""
    })
    const [currentFilter, setCurrentFilter] = useState({
        page: 1,
        order: "username",
        ...formFilter
    })

    useEffect(() => {
        async function fetchData() {
            // await fetchJson("/api/users").then((res) => {
            //     // setUser(res)
            //     console.log(res)
            //     setLoading(false)
            // }).catch((err) => { console.log(err) })

            await fetchJson("/api/users", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                // body: JSON.stringify(data),
            }).then((res) => {
                // setUser(res)
                console.log(res)
                setLoading(false)
            }).catch((err) => { console.log(err) })
        }

        if (loading) fetchData()
        return () => setLoading(false)
    }, [loading])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await fnUsers.Get(currentFilter).then((res) => {
    //             setTableData(res)
    //             setLoading(false)
    //         }).catch((err) => { return }) //do nothing, let it go back to login
    //     }

    //     if (loading) fetchData()
    //     return () => setLoading(false)
    // }, [loading])

    const router = useRouter()
    const options = {
        title: {
            text: 'My chart'
        },
        series: [{
            data: [1, 2, 3]
        }]
    }
    const barChart = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Monthly Average Rainfall'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rainfall (mm)'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
            name: 'New York',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
            name: 'London',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }, {
            name: 'Berlin',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        }]
    }

    return (
        <MainLayout title="asd" user={JSON.stringify(user, null, 2)}>
            <div className="container-fluid">
                <h1 className="mt-4">Users</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item active">Users</li>
                </ol>
                <div className="row">
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-primary text-white mb-4">
                            <div className="card-body">Primary Card</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href="#">View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-warning text-white mb-4">
                            <div className="card-body">Warning Card</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href="#">View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-success text-white mb-4">
                            <div className="card-body">Success Card</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href="#">View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-3 col-md-6">
                        <div className="card bg-danger text-white mb-4">
                            <div className="card-body">Danger Card</div>
                            <div className="card-footer d-flex align-items-center justify-content-between">
                                <a className="small text-white stretched-link" href="#">View Details</a>
                                <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-chart-area mr-1"></i>
                                        Area Chart Example
                                    </div>
                            <div className="card-body">{/*<canvas id="myAreaChart" width="100%" height="40"></canvas>*/}
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <div className="card mb-4">
                            <div className="card-header">
                                <i className="fas fa-chart-bar mr-1"></i>
                                        Bar Chart Example
                                    </div>
                            <div className="card-body">{/*<canvas id="myBarChart" width="100%" height="40"></canvas>*/}
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={barChart}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {user?.isLoggedIn && (
                <>
                    <p style={{ fontStyle: "italic" }}>{user.login}
                        Public data, from{" "}
                        <a href={`https://github.com/${user.login}`}>
                            https://github.com/{user.login}
                        </a>
                        , reduced to `login` and `avatar_url`.
                    </p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}
        </MainLayout>
    )
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    const user = req.session.user;

    if (user === undefined) {
        res.setHeader("location", "/login");
        res.statusCode = 302;
        res.end();
        return {
            props: {
                user: { isLoggedIn: false, login: "", avatarUrl: "" },
            },
        };
    }

    return {
        props: {
            // req: req,
            // res: res,
            user: req.session.user
        },
    };
}, sessionOptions);
