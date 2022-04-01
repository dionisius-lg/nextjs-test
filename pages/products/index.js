import { useState, useEffect } from "react";
import { Card, Modal, Form, Row, Col, Button, Spinner, Table } from "react-bootstrap";
import { AlertError, AlertSuccess, AlertWarning } from "components/Alert";
import { isEmptyValue } from "utils/general";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import fetchJson, { FetchError } from "lib/fetchJson";
import MainLayout from "components/layouts/MainLayout";
import CustomSelect from "components/CustomSelect";
import Pagination from "components/Pagination";
import FormAdd from "pages/products/add";
import FormDetail from "pages/products/detail";

export default function Products() {
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [alert, setAlert] = useState(initAlert)
    const [tableData, setTableData] = useState({})

    const [modalAdd, setModalAdd] = useState(initModal)
    const [modalDetail, setModalDetail] = useState(initModal)
    const [modalDelete, setModalDelete] = useState(initModal)
    const [optProductCategories, setOptProductCategories] = useState(initOptSelect)

    const [filter, setFilter] = useState({
        name: "",
        product_category_id: "",
    })

    const [currentFilter, setCurrentFilter] = useState({
        page: 1,
        order: "name",
        limit: 10,
        ...filter
    })

    const onChangeFilter = (key, val) => {
        setFilter({ ...filter, [key]: val })
    }

    const onSubmitFilter = (e) => {
        e.preventDefault()

        setCurrentFilter({
            ...currentFilter,
            ...filter,
            page: 1
        })
        setIsLoading(true)
    }

    useEffect(() => {
        async function initFetch() {
            const params = `?${new URLSearchParams(currentFilter)}`

            await fetchJson(`/api/products${params}`).then((res) => {
                setTableData(res)
            }).catch((err) => {
                if (err instanceof FetchError) {
                    console.log(err.response)
                } else {
                    console.log(err)
                }

                setTableData({})
            })

            setIsLoading(false)
        }

        if (isLoading) initFetch()
        return () => setIsLoading(false)
    }, [isLoading])

    useEffect(() => {
        async function initFetch() {
            await fetchJson(`/api/product_categories?${new URLSearchParams({
                limit: 100,
                order: "name",
                is_active: 1
            })}`).then((res) => {
                if (!isEmptyValue(res.data)) {
                    let mapOptSelect = res.data.map((row) => {
                        return { value: row.id, label: row.name }
                    })

                    setOptProductCategories([
                        ...initOptSelect,
                        ...mapOptSelect
                    ])
                }
            }).catch((err) => {
                if (err instanceof FetchError) {
                    console.log(err.response)
                } else {
                    console.log(err)
                }
            })
        }

        initFetch()
        return () => setOptProductCategories(initOptSelect)
    }, [])

    const handleModalAdd = () => {
        setModalAdd({
            ...modalAdd,
            show: !modalAdd.show
        })
    }

    const handleModalDetail = (id) => {
        setModalDetail({
            ...modalDetail,
            show: !modalDetail.show,
            dataId: id
        })
    }

    const handleModalDelete = (id) => {
        setModalDelete({
            ...modalDelete,
            show: !modalDelete.show,
            dataId: id
        })
    }

    const handleModalClose = () => {
        setModalAdd(initModal)
        setModalDetail(initModal)
        setModalDelete(initModal)
    }

    const handleDelete = async (id) => {
        setIsDeleting(true)

        await fetchJson(`/api/products/${id}`, {
            method: "DELETE"
        }).then((res) => {
            if (res.success) {
                setAlert({
                    title: "Success",
                    message: "Data has been deleted.",
                    show: true,
                    type: "success"
                })
                setIsLoading(true)
            } else {
                setAlert({
                    title: "Error",
                    message: "Failed to delete data.",
                    show: true,
                    type: "error"
                })
            }
        }).catch((err) => {
            if (err instanceof FetchError) {
                console.log(err.response)
            } else {
                console.log(err)
            }

            setAlert({
                title: "Error",
                message: "Failed to delete data.",
                show: true,
                type: "error"
            })
        })

        setIsDeleting(false)
        return handleModalClose()
    }

    return (
        <>
            <MainLayout title="asd">
                <h1 className="mt-4">Products</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item"><a href="index.html">Settings</a></li>
                    <li className="breadcrumb-item active">Products</li>
                </ol>
                {alert.show && alert.type === 'error' && <AlertError
                    title={alert.title}
                    message={alert.message}
                    show={alert.show}
                    showChange={() => { setAlert(initAlert) }}
                />}
                {alert.show && alert.type === 'success' && <AlertSuccess
                    title={alert.title}
                    message={alert.message}
                    show={alert.show}
                    showChange={() => { setAlert(initAlert) }}
                />}
                {alert.show && alert.type === 'warning' && <AlertWarning
                    title={alert.title}
                    message={alert.message}
                    show={alert.show}
                    showChange={() => { setAlert(initAlert) }}
                />}
                <Card className="mb-4">
                    <Card.Header>
                        <i className="fas fa-table mr-1"></i> Filter Data
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={onSubmitFilter}>
                            <Form.Row>
                                <Form.Group className="col-md-2">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={filter.name}
                                        onChange={e => onChangeFilter('name', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="col-md-2">
                                    <Form.Label>Product Category</Form.Label>
                                    <CustomSelect
                                        optionSelect={optProductCategories}
                                        value={filter.product_category_id}
                                        onChangeValue={(value) => onChangeFilter('product_category_id', value)}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group className="col-md-12 mb-0">
                                    <Button type="submit" variant="primary">Search</Button>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                    </Card.Body>
                </Card>
                <Card>
                    <Card.Body className="mb-4 pb-0">
                        <Button variant="outline-primary" onClick={handleModalAdd}>Add Data</Button>
                        <hr />
                        <Table striped hover responsive width="100%" cellSpacing="0" cellPadding="0">
                            <thead className="thead-dark">
                                <tr>
                                    <th className="text-nowrap">No.</th>
                                    <th className="text-nowrap">Name</th>
                                    <th className="text-nowrap">Product Category</th>
                                    <th className="text-nowrap">Create Date</th>
                                    <th className="text-nowrap">Create User</th>
                                    <th className="text-nowrap">Update Date</th>
                                    <th className="text-nowrap">Update User</th>
                                    <th className="text-nowrap">Active</th>
                                    <th className="text-nowrap text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading &&
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <Spinner animation="border" size="sm" className="mr-1" />
                                            Loading data...
                                        </td>
                                    </tr>
                                }
                                {!isLoading && isEmptyValue(tableData.data) &&
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <span className="text-danger">No data found</span>
                                        </td>
                                    </tr>
                                }
                                {!isLoading && !isEmptyValue(tableData.data) &&
                                    tableData.data.map((row, i) => (
                                        <tr key={row.id}>
                                            <td>{tableData.paging.index[i]}</td>
                                            <td>{row.name}</td>
                                            <td>{row.product_category}</td>
                                            <td>{row.create_date}</td>
                                            <td>{row.create_fullname}</td>
                                            <td>{row.update_date}</td>
                                            <td>{row.update_fullname}</td>
                                            <td>{String(row.is_active) === "1" ? "Yes" : "No"}</td>
                                            <td className="text-center">
                                                <Button variant="warning" size="sm" className="m-1" title="Detail Data" onClick={(e) => { handleModalDetail(row.id) }}>
                                                    <i className="fas fa-edit fa-fw"></i>
                                                </Button>
                                                <Button variant="danger" size="sm" className="m-1" title="Delete Data" onClick={(e) => { handleModalDelete(row.id) }}>
                                                    <i className="fas fa-trash fa-fw"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
                {!isLoading && !isEmptyValue(tableData.paging) &&
                    <Pagination
                        total={tableData.total_data}
                        limit={tableData.limit}
                        paging={tableData.paging}
                        pageChange={(page) => {
                            setCurrentFilter({
                                ...currentFilter,
                                page: page
                            })
                            setIsLoading(true)
                        }}
                    />
                }
            </MainLayout>

            <Modal show={modalAdd.show} onHide={handleModalClose} backdrop="static" keyboard={false}>
                <FormAdd
                    changeModal={(params) => {
                        handleModalClose()
                    }}
                    changeAlert={(params) => {
                        setAlert({
                            ...alert,
                            ...params
                        })
                    }}
                    changeData={() => {
                        setIsLoading(true)
                    }}
                />
            </Modal>

            <Modal show={modalDetail.show} onHide={handleModalClose} backdrop="static" keyboard={false}>
                <FormDetail
                    changeModal={(params) => {
                        handleModalClose()
                    }}
                    changeAlert={(params) => {
                        setAlert({
                            ...alert,
                            ...params
                        })
                    }}
                    changeData={() => {
                        setIsLoading(true)
                    }}
                    dataId={modalDetail.dataId}
                />
            </Modal>

            <Modal show={modalDelete.show} onHide={handleModalClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton={isDeleting ? false : true}>
                    <Modal.Title>Delete User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure to delete this data?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" disabled={isDeleting} onClick={() => { handleDelete(modalDelete.dataId) }}>
                        {isDeleting && <Spinner animation="border" size="sm" className="mr-1" />} Delete
                    </Button>
                    <Button variant="light" disabled={isDeleting} onClick={handleModalClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
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
                user: { isLoggedIn: false },
            },
        };
    }

    return {
        props: {
            user: req.session.user
        },
    };
}, sessionOptions);

const initModal = {
    show: false,
    dataId: null
}

const initAlert = {
    title: "",
    message: "",
    show: false,
    type: null
}

const initOptSelect = [{
    value: "",
    label: "Choose..."
}]