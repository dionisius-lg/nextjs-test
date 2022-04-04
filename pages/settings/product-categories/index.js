import { useState, useEffect } from "react"
import { Card, Modal, Form, Row, Col, Button, Spinner, Table } from "react-bootstrap"
import { isEmptyValue } from "utils/general"
import fetchJson, { FetchError } from "lib/fetchJson"
import useUser from "lib/useUser"
import useEvents from "lib/useEvents"
import LoadingLayout from "components/layouts/LoadingLayout"
import MainLayout from "components/layouts/MainLayout"
import Notification from "components/Notification"
import Pagination from "components/Pagination"
import FormAdd from "pages/settings/product-categories/add"
import FormDetail from "pages/settings/product-categories/detail"


export default function ProductCategories() {
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [tableData, setTableData] = useState({})
    const [notif, setNotif] = useState({
        type: null,
        message: "",
        show: false
    })

    const [modalAdd, setModalAdd] = useState(initModal)
    const [modalDetail, setModalDetail] = useState(initModal)
    const [modalDelete, setModalDelete] = useState(initModal)

    const [filter, setFilter] = useState({
        name: "",
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

            await fetchJson(`/api/product_categories${params}`).then((res) => {
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

        await fetchJson(`/api/product_categories/${id}`, {
            method: "DELETE"
        }).then((res) => {
            if (res.success) {
                setNotif({
                    type: "success",
                    message: "Data has been deleted.",
                    show: true
                })
                setIsLoading(true)
            } else {
                setNotif({
                    type: "error",
                    message: "Failed to delete data.",
                    show: true
                })
            }
        }).catch((err) => {
            if (err instanceof FetchError) {
                console.log(err.response)
            } else {
                console.log(err)
            }

            setNotif({
                type: "error",
                message: "Failed to delete data.",
                show: true
            })
        })

        setIsDeleting(false)
        return handleModalClose()
    }

    const { user } = useUser({ redirectTo: "/login" })
    const { loadingEvents } = useEvents(user)

    if (!user?.isLoggedIn || loadingEvents) {
        return <LoadingLayout />
    }

    return (
        <>
            <MainLayout title="Product Categories">
                <h1 className="mt-4">Product Categories</h1>
                <ol className="breadcrumb mb-4">
                    <li className="breadcrumb-item"><a href="index.html">Settings</a></li>
                    <li className="breadcrumb-item active">Product Categories</li>
                </ol>
                {notif.show && <Notification
                    type={notif.type}
                    message={notif.message}
                    show={notif.show}
                    changeShow={() => setNotif({
                        type: null,
                        message: "",
                        show: false
                    })}
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
                                        <td colSpan="8" className="text-center">
                                            <Spinner animation="border" size="sm" className="mr-1" />
                                            Loading data...
                                        </td>
                                    </tr>
                                }
                                {!isLoading && isEmptyValue(tableData.data) &&
                                    <tr>
                                        <td colSpan="8" className="text-center">
                                            <span className="text-danger">No data found</span>
                                        </td>
                                    </tr>
                                }
                                {!isLoading && !isEmptyValue(tableData.data) &&
                                    tableData.data.map((row, i) => (
                                        <tr key={row.id}>
                                            <td>{tableData.paging.index[i]}</td>
                                            <td>{row.name}</td>
                                            <td>{row.create_date}</td>
                                            <td>{row.create_fullname}</td>
                                            <td>{row.update_date}</td>
                                            <td>{row.update_fullname}</td>
                                            <td>{String(row.is_active) === "1" ? "Yes" : "No"}</td>
                                            <td className="text-nowrap text-center">
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
                    changeModal={handleModalClose}
                    changeNotif={(obj) => setNotif({ ...notif, ...obj })}
                    changeData={() => setIsLoading(true)}
                />
            </Modal>

            <Modal show={modalDetail.show} onHide={handleModalClose} backdrop="static" keyboard={false}>
                <FormDetail
                    changeModal={handleModalClose}
                    changeNotif={(obj) => setNotif({ ...notif, ...obj })}
                    changeData={() => setIsLoading(true)}
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

const initModal = {
    show: false,
    dataId: null
}

const initOptSelect = [{
    value: "",
    label: "Choose..."
}]
