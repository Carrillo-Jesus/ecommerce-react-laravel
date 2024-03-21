/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Demo } from '../../../../types/types';
import MultiSelectCategories from '../../features/Categories/MultiSelect';
import SelectBrand from '../../features/brands/SelectBrand';
import ProductImages from '../../features/products/ProductImages';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
const Product = ({ submitted, product, productDialog, hideDialog, UpdateProduct, saveProduct, isEdit }: {
    submitted: boolean;
    product: Demo.Product;
    productDialog: boolean;
    hideDialog: () => void;
    UpdateProduct: (product: Demo.Product) => void;
    saveProduct: () => void;
    isEdit: boolean;
  }) => {
   
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value } = e.target;
        let _product = { ...product };
        _product[name] = value
        UpdateProduct(_product);
    };

    const updateCategories = (value: Demo.Category[]) => {
        let _product = { ...product };
        _product['categories'] = value;
        UpdateProduct(_product);
    };

    const updateBrand = (value: Demo.Brand) => {
        let _product = { ...product };
        _product['brand_id'] = value.id;
        UpdateProduct(_product);
    }

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;
        UpdateProduct(_product);
    };

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        const {name, value } = e.target;
        let _product = { ...product };
        _product[name] = !value;
        UpdateProduct(_product);
    };

    const updateImages = (value: File[]) => {
        let _product = { ...product };
        _product['images'] = value;
        UpdateProduct(_product);
    };

    const updateThumbnail = (value: File | null) => {
        let _product = { ...product };
        _product['thumbnail'] = value;
        UpdateProduct(_product);
    }

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );

    return (

        <Dialog style={{width: '90vw'}} visible={productDialog} header="Detalles del producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            <img src={`${typeof product.thumbnail === 'string' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/products/thumbnails/${product.thumbnail}` : 'https://placehold.co/500x500?text='+product.name}`} alt={product.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={product.name}
                        onChange={onInputChange}
                        required
                        name="name"
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !product.name
                        })}
                    />
                    {submitted && !product.name && <small className="p-invalid">El nombre es requerido.</small>}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Sku</label>
                    <InputText
                        id="sku"
                        value={product.sku}
                        onChange={onInputChange}
                        required
                        name="sku"
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !product.sku
                        })}
                    />
                    {submitted && !product.sku && <small className="p-invalid">El sku es requerido.</small>}
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Handle</label>
                    <InputText
                        id="handle"
                        value={product.handle}
                        onChange={onInputChange}
                        name="handle"
                        autoFocus
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="quantity">Cantidad</label>
                    <InputNumber name='stock' id="quantity" value={product.stock} onValueChange={(e) => onInputNumberChange(e, 'stock')} />
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col-12 md:col-6">
                    <MultiSelectCategories onValueReceivedCategories = { updateCategories } />
                </div>
                <div className="field col-12 md:col-6">
                    <SelectBrand onValueReceivedBrand = { updateBrand } />
                </div>
            </div>

            <div className="formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="cost">Costo</label>
                    <InputNumber id="cost" value={ product.cost } onValueChange={(e) => onInputNumberChange(e, 'cost')} mode="currency" currency="USD" locale="en-US" />
                    { submitted && !product.cost && <small className="p-invalid">El costo es requerido.</small> }
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="price">Precio</label>
                    <InputNumber required id="price" value={ product.price } onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" 
                        className={classNames({
                            'p-invalid': submitted && !product.price
                        })}
                    />
                    { submitted && !product.price && <small className="p-invalid">El precio es requerido.</small> }
                </div>
            </div>

            <div className="field">
                <label htmlFor="description">Descripción</label>
                <InputTextarea name='description' id="description" value={product.description} onChange={onInputChange} required rows={3} cols={20} />
            </div>

            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="field-checkbox">
                        <Checkbox inputId="checkOption1" name="is_giftcard" value={product.is_giftcard} checked={ product.is_giftcard } onChange={onCheckboxChange} />
                        <label htmlFor="checkOption1">Es GiftCard</label>
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="field-checkbox">
                        <Checkbox inputId="checkOption2" name="is_active" value={product.is_active} checked={ product.is_active } onChange={onCheckboxChange} />
                        <label htmlFor="checkOption2">Está activo</label>
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="field-checkbox">
                        <Checkbox inputId="checkOption3" name="featured" value={product.featured} checked={ product.featured } onChange={onCheckboxChange} />
                        <label htmlFor="checkOption3">Destacar</label>
                    </div>
                </div>
            </div>
            <div className="field">
                <ProductImages product = { product } updateImages = { updateImages } updateThumbnail = { updateThumbnail }/>
            </div>
            
        </Dialog>

    )
}

export default Product;