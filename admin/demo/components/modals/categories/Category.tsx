/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState,  RefObject} from 'react';
import { Demo } from '../../../../types/types';
import axios from '~/demo/service/config';
const Category = ({ category, setCategoryDialog, categoryDialog, hideDialog, UpdateCategory, isEdit, }: {
    category: Demo.Category;
    setCategoryDialog: (show: boolean) => void;
    categoryDialog: boolean;
    hideDialog: () => void;
    UpdateCategory: (category: Demo.Category) => void;
    isEdit: boolean;
  }) => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const modalRef: RefObject<HTMLDivElement | null> = useRef(null);
   
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let _category = { ...category };
        _category[name] = value
        UpdateCategory(_category);
    };

    const updateImage = (value: File | null) => {
        let _category = { ...category };
        _category['image'] = value;
        UpdateCategory(_category);
    }

    const save = () => {
        setSubmitted(true);
        axios.post(`/api/categories`, category)
        .then( response => {
          setTimeout(() => {
            setSubmitted(false);
            if(modalRef.current) modalRef.current.dispatchEvent(new Event('categorySaved'));
            setCategoryDialog(false);
          }, 500)
        }).catch(e => {
            console.warn(e);
            setSubmitted(false);
        });
    }

    const update = () => {
        setSubmitted(true);
        axios.put(`/api/categories/${category.id}`, category)
        .then( response => {
          setTimeout(() => {
            setSubmitted(false);
            if(modalRef.current) modalRef.current.dispatchEvent(new Event('categorySaved'));
            setCategoryDialog(false);
          }, 500)
        }).catch(e => {
            console.warn(e);
            setSubmitted(false);
        });
    }

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            {
                isEdit 
                ?
                <Button loading={ submitted } label="Actualizar" icon="pi pi-check" text onClick={update} />
                :
                <Button loading={ submitted } label="Guardar" icon="pi pi-check" text onClick={save} />
        
            }
            
        </>
    );

    return (

        <Dialog style={{width: '90vw'}} visible={categoryDialog} header="Detalles de la categoría" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
            {/* <img src={`${typeof category.image === 'string' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/categories/${category.image}` : 'https://placehold.co/500x500?text='+category.name}`} alt={category.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" /> */}
            <div ref={modalRef as React.RefObject<HTMLDivElement>} id='new-category' className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={category.name}
                        onChange={onInputChange}
                        required
                        name="name"
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !category.name
                        })}
                    />
                    {submitted && !category.name && <small className="p-invalid">El nombre es requerido.</small>}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre corto</label>
                    <InputText
                        id="short_name"
                        value={category.short_name}
                        onChange={onInputChange}
                        required
                        name="short_name"
                        className={classNames({
                            'p-invalid': submitted && !category.short_name
                        })}
                    />
                    {submitted && !category.short_name && <small className="p-invalid">El nombre corto es requerido.</small>}
                </div>

                <div className="field col-12">
                    <label htmlFor="name">Handle</label>
                    <InputText
                        id="handle"
                        value={category.handle}
                        onChange={onInputChange}
                        name="handle"
                    />
                </div>
            </div>

            <div className="field">
                <label htmlFor="description">Descripción</label>
                <InputTextarea name='description' id="description" value={category.description} onChange={onInputChange} rows={3} cols={20} />
            </div>

            {/* <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="field-checkbox">
                        <Checkbox inputId="checkOption1" name="is_active" value={category.status} checked={ category.status } onChange={onCheckboxChange} />
                        <label htmlFor="checkOption1">Está activa</label>
                    </div>
                </div>
            </div>  */}
        </Dialog>

    )
}

export default Category;