'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable} from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../types/types';
import { useFetchProducts } from '../../../demo/service/hooks/products';
import { getDefaultImage } from '~/helpers/helpers';
import Link from 'next/link';
import axios from '~/demo/service/config';
import { useRouter } from 'next/navigation';
import emitter from '~/helpers/events';
const Products = () => {
    let emptyProduct: Demo.Product = {
        id: '',
        name: '',
        handle: '',
        description: '',
        price: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK',
        sku: '',
        images: [],
        cost: 0,
        stock: 100,
        stock_alert: 10,
        brand: {
            name: '',
            id: '',
            short_name: '',
            description: '',
            image: '',
            handle: ''
        },
        featured: false,
        tax_rate: 0,
        shipping_required: true,
        free_shipping: false,
        thumbnail: null,
        collection_id: '',
        is_active: true,
        is_giftcard: false,
        categories: []
    };
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [first, setFirst] = useState(0);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    let { products, loading, meta } = useFetchProducts(currentPage, itemsPerPage, globalFilter);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const onPageChange = (event: PaginatorPageChangeEvent) => {
        setCurrentPage(event.page + 1);
        setItemsPerPage(event.rows);
        setFirst(event.first);
    };


    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const confirmDeleteProduct = (product: Demo.Product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        axios.delete(`api/products/${product.id}`)
        .then(response => {
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: response.data.message,
                life: 3000
            });
            setProduct(emptyProduct);
            setDeleteProductDialog(false);
            emitter.emit('updateProducts');
        })
        .catch(error => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.message,
                life: 3000
            });
        
        });

    };
   

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {

        const ids = (selectedProducts as any)?.map((product: Demo.Product) => product.id);
       
        axios.post(`api/products/multipleElimination`, { ids: ids })
        .then(response => {
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: response.data.message,
                life: 3000
            });
            emitter.emit('updateProducts');
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
        })
        .catch(error => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response.data.message,
                life: 3000
            });
        });
       
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Link href="/products/store">
                        <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" />
                    </Link>
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !(selectedProducts as any).length} />
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

    const codeBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Sku</span>
                {rowData.sku}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Imagen</span>
                <img onError={(e) => getDefaultImage(e, rowData.name)} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/thumbnails/${rowData.thumbnail}`} alt={rowData.name} className="shadow-2" width="100" />
            </>
        );
    };

    const costBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Costo</span>
                {formatCurrency(rowData.cost as number)}
            </>
        );
    };

    const priceBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Precio</span>
                {formatCurrency(rowData.price as number)}
            </>
        );
    };

    const brandBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Marca</span>
                {rowData.brand && rowData.brand.name}
            </>
        );
    };

    const statusBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`product-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Demo.Product) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => router.push('/products/edit/'+rowData.id)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Administrar productos</h5>
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

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
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
                                value={products}
                                selection={selectedProducts}
                                onSelectionChange={(e) => setSelectedProducts(e.value as any)}
                                dataKey="id"
                                className="datatable-responsive"
                                emptyMessage="No se encontraron prodcutos"
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                                <Column field="sku" header="Sku" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column field="name" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                                <Column header="Imagen" body={imageBodyTemplate}></Column>
                                <Column field="cost" header="Costo" body={costBodyTemplate} sortable></Column>
                                <Column field="price" header="Precio" body={priceBodyTemplate} sortable></Column>
                                <Column field="brand" header="Marca" sortable body={brandBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column field="inventoryStatus" header="Estado" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                                <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                            </DataTable>
                            <Paginator   template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" first={first} rows={itemsPerPage} totalRecords={meta.total} rowsPerPageOptions={[5, 10, 25, 50]} onPageChange={onPageChange}></Paginator>

                            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {product && (
                                        <span>
                                           ¿Estás seguro de que quieres eliminar <b>{product.name}</b>?
                                        </span>
                                    )}
                                </div>
                            </Dialog>

                            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                                <div className="flex align-items-center justify-content-center">
                                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                    {product && <span>¿Estás seguro de que deseas eliminar los productos seleccionados?</span>}
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

export default Products;
