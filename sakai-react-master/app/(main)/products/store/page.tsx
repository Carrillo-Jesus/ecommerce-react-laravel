/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import React, { useState } from 'react';
import { Demo } from '~/types/demo';
import MultiSelectCategories from '~/demo/components//features/Categories/MultiSelect';
import SelectBrand from '~/demo/components/features/brands/SelectBrand';
import ProductImages from '~/demo/components/features/products/ProductImages';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import axios from '~/config';
import { useRouter } from 'next/navigation';

const Product = () => {

    let emptyProduct: Demo.Product = {
        name: '',
        handle:'',
        description: '',
        price: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK',
        sku: '',
        cost: 0,
        stock: 100,
        stock_alert: 10,
        brand: {
            name: '',
            id: '',
            short_name: '',
            description: '',
            image: '',            
            handle: '',
        },
        featured: false,
        tax_rate: 0,
        shipping_required: true,
        free_shipping: false,
        collection_id: '',
        is_active:  true,
        is_giftcard:  false,
        categories: []
    };
    const router = useRouter();
    const [product, setProduct] = useState<Demo.Product>(emptyProduct);
    const [thumbnail, setThumbnail] = useState<File | null | string>(null);
    const [images, setImages] = useState< File[] | string[]>([]);
    const [submitted, setSubmitted] = useState(false);
   
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value } = e.target;
        let _product = { ...product };
        _product[name] = value
        setProduct(_product);
    };

    const updateCategories = (value: Demo.Category[]) => {
        let _product = { ...product };
        _product['categories'] = value;
        setProduct(_product);
    };

    const updateBrand = (value: Demo.Brand) => {
        let _product = { ...product };
        _product['brand_id'] = value.id;
        setProduct(_product);
    }

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _product = { ...product };
        _product[`${name}`] = val;
        setProduct(_product);
    };

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        const {name, value } = e.target;
        let _product = { ...product };
        _product[name] = !value;
        setProduct(_product);
    };

    const updateImages = (value: File[] | string[]) => {
        // let _product = { ...product };
        // _product['images'] = value;
        setImages(value);
    };

    const updateThumbnail = (value: File | null) => {
        // let _product = { ...product };
        // _product['thumbnail'] = value;
        setThumbnail(value);
    }

    //const csrf = () => axios.get('/sanctum/csrf-cookie')

    const saveProduct = async(e: React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
    
        setSubmitted(true);
        const data = new FormData();
    
        if (thumbnail) data.append('thumbnail', thumbnail);
    
        images.forEach((image) => {
            data.append('images[]', image);
        });

        for (const field in emptyProduct) {
              data.append(field, product[field]);
        }

        //await csrf();
    
        axios.post(`/api/products`, data)
        .then( response => {
          setProduct(emptyProduct);
          setSubmitted(false);
          router.push('/products');
        }).catch(e => {
            console.warn(e);
            setSubmitted(false);
        });
    }


    return (

        <div className="grid crud-demo">
            <form action="#" method="get" onSubmit={ saveProduct } className="input-wrapper">
            <div className="card">
                <div className="formgrid grid">
                    {/* <img src={`${typeof product.thumbnail === 'string' ? `${config.backendUrl}/images/products/thumbnails/${product.thumbnail}` : 'https://placehold.co/500x500?text='+product.name}`} alt={product.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" /> */}
                    <div className="col-12 md:col-8">
                        <h5>Detalles del producto</h5>
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

                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <MultiSelectCategories onValueReceivedCategories = { updateCategories } />
                            </div>
                            <div className="field col-12 md:col-6">
                                <SelectBrand onValueReceivedBrand = { updateBrand } />
                            </div>
                        </div>

                        <div className="formgrid grid p-fluid ">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="cost">Costo</label>
                                <InputNumber id="cost" value={ product.cost } onValueChange={(e) => onInputNumberChange(e, 'cost')} mode="currency" currency="USD" locale="en-US" />
                                { submitted && !product.cost && <small className="p-invalid">El costo es requerido.</small> }
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="price">Precio</label>
                                <InputNumber required id="price" value={ product.price } onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" 
                                    className={classNames({'p-invalid': submitted && !product.price})}
                                />
                                { submitted && !product.price && <small className="p-invalid">El precio es requerido.</small> }
                            </div>
                        </div>

                        <div className="field p-fluid">
                            <label htmlFor="description">Descripción</label>
                            <InputTextarea name='description' id="description" value={product.description} onChange={onInputChange} required rows={3} cols={20} />
                        </div>

                        <div className="grid p-fluid">
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
                        
                    </div>
                    <div className='col-12 md:col-4'>
                    <h5>Imágenes del producto</h5>
                        <div className="field">
                            <ProductImages product = { product } updateImages = { updateImages } updateThumbnail = { updateThumbnail }/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-100 mb-4 pl-4'>
                <Button label="Guardar" icon="pi pi-check" loading={ submitted } type='submit' />
            </div>
            </form>
           
        </div>
    )
}

export default Product;