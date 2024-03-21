import { Dropdown, DropdownFilterEvent } from 'primereact/dropdown';
import { useState, useEffect } from 'react';
import { useFetchBrands } from '../../../../layout/hooks/brands';
import { Demo } from '../../../../types/types';
function SelectBrand({ onValueReceivedBrand }: {onValueReceivedBrand: (value: Demo.Brand) => void}) {
    const [page, setPage] = useState(1);
    const [limit, setLiimit] = useState(10);
    const [search, setSearch] = useState('');
    const [selectedBrand, setSelectedBrand] = useState<null | Demo.Brand>(null);

    
    useEffect(() => {
        sendValueToParent()
    }, [selectedBrand])

    const sendValueToParent = () => {
        if (selectedBrand) {
            onValueReceivedBrand(selectedBrand);
        }
    };

    const {brands, loading, meta} = useFetchBrands(page, limit, search);

    const selectedBrandTemplate = (option: Demo.Brand, props: any) => {
        if (option) {
            return (
                <div className="flex align-items-center">
                    <div>{option.name}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const handleFilterCtageories = (event: DropdownFilterEvent) => {
        let filterBrands = brands.filter((item) => item.name.toLocaleLowerCase().includes(event.filter.toLocaleLowerCase()));
        if(filterBrands.length <= 2) {
            setSearch(event.filter);
        }
    }

    const BrandOptionTemplate = (option: Demo.Brand) => {
        return (
            <div className="flex align-items-center">
                <div>{option.name}</div>
            </div>
        );
    };



    return (  
        <>
            <label className="mb-3">Marca</label>
            {
                !loading ?
                    <Dropdown value={ selectedBrand}  onChange={(e) => setSelectedBrand(e.value)} options={ brands } optionLabel="name" placeholder="Seleccione una marca" 
                    filter   onFilter={ handleFilterCtageories } valueTemplate={selectedBrandTemplate} itemTemplate={BrandOptionTemplate} className="w-full" />
                :
                    <div className="flex justify-content-center align-items-center">
                        <i className="pi pi-spin pi-spinner mx-auto" style={{ fontSize: '2rem' }}></i>
                    </div>
            }
        </>
    );
}

export default SelectBrand;