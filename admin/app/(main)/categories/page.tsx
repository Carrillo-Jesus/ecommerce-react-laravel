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
import { useFetchCategories } from '~/demo/service/hooks/categories';
import Category from '~/demo/components/modals/categories/Category';
import axios from '~/demo/service/config';
import { getDefaultImage } from '~/helpers/helpers';

const Categories = () => {
    let emptyCategory: Demo.Category = {
        id: '',
        name: '',
        handle: '',
        description: '',
        image: null,
        short_name: ''
    };

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [CategoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [deleteCategoriesDialog, setDeleteCategoriesDialog] = useState(false);
    const [category, setCategory] = useState<Demo.Category>(emptyCategory);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const { categories, loading, meta } = useFetchCategories(currentPage, itemsPerPage, globalFilter, submitted);

    const openNew = () => {
        setCategory(emptyCategory);
        setIsEdit(false);
        setCategoryDialog(true);
    };

    const editCategory = (category: Demo.Category) => {
        setCategory({ ...category });
        setCategoryDialog(true);
        setIsEdit(true);
    };

    const UpdateCategory = (category: Demo.Category) => {
        setCategory({ ...category });
    };

    const hideDialog = () => {
        setCategoryDialog(false);
        setIsEdit(false);
    };

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    };

    const hideDeleteCategoriesDialog = () => {
        setDeleteCategoriesDialog(false);
    };

    const confirmDeleteCategory = (category: Demo.Category) => {
        setCategory(category);
        setDeleteCategoryDialog(true);
    };

    const deleteCategory = () => {
        setSubmitted(true);
        axios
            .delete(`/api/categories/${category.id}`)
            .then((response) => {
                setTimeout(() => {
                    setSubmitted(false);
                    hideDeleteCategoryDialog();
                }, 500);
            })
            .catch((e) => {
                console.warn(e);
                setSubmitted(false);
            });
    };

    const findIndexById = (id: string) => {
        let index = -1;
        for (let i = 0; i < (categories as any)?.length; i++) {
            if ((categories as any)[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteCategoriesDialog(true);
    };

    const deleteSelectedCategories = () => {
        let _products = (categories as any)?.filter((val: any) => !(selectedCategories as any)?.includes(val));
        //setProducts(_products);
        setDeleteCategoriesDialog(false);
        setSelectedCategories(null);
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
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedCategories || !(selectedCategories as any).length} />
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

    const codeBodyTemplate = (rowData: Demo.Category) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Category) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    };

    const shortNameBodyTemplate = (rowData: Demo.Category) => {
        return (
            <>
                <span className="p-column-title">Nombre corto</span>
                {rowData.short_name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Category) => {
        return (
            <>
                <span className="p-column-title">Imagen</span>
                <img onError={(e) => getDefaultImage(e, rowData.name)} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/categories/${rowData.image}`} alt={rowData.name} className="shadow-2" width="100" />
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Category) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className="product-badge status">N/A</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Category) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteCategory(rowData)} />
            </>
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

    const deleteCategoryDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoryDialog} />
            <Button loading={submitted} label="Si" icon="pi pi-check" text onClick={deleteCategory} />
        </>
    );
    const deleteCategoriesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteCategoriesDialog} />
            <Button label="Si" icon="pi pi-check" text onClick={deleteSelectedCategories} />
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
                                value={categories}
                                selection={selectedCategories}
                                onSelectionChange={(e) => setSelectedCategories(e.value as any)}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                //globalFilter={globalFilter}
                                emptyMessage="No se encontraron prodcutos"
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column header="Imagen" body={imageBodyTemplate}></Column>
                                {/* <Column field="id" header="Id" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                                <Column field="short_name" header="Nombre corto" sortable body={shortNameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="inventoryStatus" header="Estado" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>

                            <Category setCategoryDialog={setCategoryDialog} isEdit={isEdit} hideDialog={hideDialog} category={category} categoryDialog={CategoryDialog} UpdateCategory={UpdateCategory} />

                            <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {category && (
                                        <span>
                                            ¿Está seguro de que quieres eliminar? <b>{category.name}</b>?
                                        </span>
                                    )}
                                </div>
                            </Dialog>

                            <Dialog visible={deleteCategoriesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteCategoriesDialogFooter} onHide={hideDeleteCategoriesDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {category && <span>¿Estás seguro de que deseas eliminar los productos seleccionados?</span>}
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

export default Categories;
