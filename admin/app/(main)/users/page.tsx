'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '~/types/types';
import { useFetchUsers } from '~/demo/service/hooks/users';
import { useFetchRoles } from '~/demo/service/hooks/roles';
import User from '~/demo/components/modals/users/User';
import axios from '~/demo/service/config';
import { getDefaultImage } from '~/helpers/helpers';

const Users = () => {
    let emptyUser: Demo.User = {
        id: '',
        name: '',
        state: true,
        email: '',
        password: '',
        password_confirmation: '',
        email_verified: false,
        role: { id: '', name: '' }
    };

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [submittedRole, setSubmittedRole] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [UserDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<Demo.User>(emptyUser);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const { users, loading, meta } = useFetchUsers(currentPage, itemsPerPage, globalFilter, submitted);

    const { roles, loadingRoles, metaRoles } = useFetchRoles(currentPage, itemsPerPage, globalFilter, submittedRole);

    const openNew = () => {
        setUser(emptyUser);
        setIsEdit(false);
        setUserDialog(true);
    };

    const editUser = (user: Demo.User) => {
        setUser({ ...user });
        setUserDialog(true);
        setIsEdit(true);
    };

    const UpdateUser = (user: Demo.User) => {
        setUser({ ...user });
    };

    const hideDialog = () => {
        setUserDialog(false);
        setIsEdit(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const confirmDeleteUser = (user: Demo.User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        setSubmitted(true);
        axios
            .delete(`/admin/users/${user.id}`)
            .then((response) => {
                setTimeout(() => {
                    setSubmitted(false);
                    hideDeleteUserDialog();
                }, 500);
            })
            .catch((e) => {
                console.warn(e);
                setSubmitted(false);
            });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        let _users = (users as any)?.filter((val: any) => !(selectedUsers as any)?.includes(val));
        //setProducts(_products);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !(selectedUsers as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const codeBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                <span style={{ textTransform: 'capitalize' }}>{rowData.name}</span>
            </>
        );
    };

    const emailBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">E-mail</span>
                {rowData.email}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                {rowData.state ? <span className="customer-badge status-qualified">{'Activo'}</span> : <span className="customer-badge status-negotiation">{'Inactivo'}</span>}
            </>
        );
    };

    const RoleBodyTemplate = (rowData: Demo.User) => {
        return (
            <>
                <span className="p-column-title">rol</span>
                <span style={{ textTransform: 'capitalize' }}> {rowData.role.name ? rowData.role.name : 'N/A'}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.User) => {
        return (
            <div className="flex justify-content-center align-items-center">
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar Categorías</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const isLoading = (
        <div className="flex justify-content-center align-items-center">
            <i className="pi pi-spin pi-spinner mx-auto" style={{ fontSize: '4rem' }}></i>
        </div>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button loading={submitted} label="Si" icon="pi pi-check" text onClick={deleteUser} />
        </>
    );
    const deleteUsersDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUsersDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deleteSelectedUsers} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    {!loading ? (
                        <>
                            <DataTable
                                ref={dt}
                                value={users}
                                selection={selectedUsers}
                                onSelectionChange={(e) => setSelectedUsers(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                //globalFilter={globalFilter}
                                emptyMessage="No se encontraron usuarios"
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                {/* <Column header="Imagen" body={imageBodyTemplate}></Column> */}
                                <Column field="email" header="E-mail" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="status" header="Estado" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '6rem' }}></Column>
                                <Column field="rol" header="Rol" body={RoleBodyTemplate}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>

                            <User submitted={submitted} setSubmitted={setSubmitted} roles={roles} setUserDialog={setUserDialog} isEdit={isEdit} hideDialog={hideDialog} user={user} userDialog={UserDialog} updateUser={UpdateUser} />

                            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {user && (
                                        <span>
                                            ¿Está seguro de que quieres eliminar a? <b>{user.name}</b>?
                                        </span>
                                    )}
                                </div>
                            </Dialog>

                            <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {user && <span>¿Estás seguro de que deseas eliminar los usuarios seleccionados?</span>}
                                </div>
                            </Dialog>
                        </>
                    ) : (
                        isLoading
                    )}
                </div>
            </div>
        </div>
    );
};

export default Users;
