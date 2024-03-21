import { MultiSelect,  MultiSelectFilterEvent  } from 'primereact/multiselect';
import { useEffect, useState } from 'react';
import { useFetchCategories } from '~/layout/hooks/categories';
import { Demo } from '../../../../types/types';

function MultiSelectCategories ({ onValueReceivedCategories }: {onValueReceivedCategories: (value: Demo.Category[]) => void}) {

    const [page, setPage] = useState(1);
    const [limit, setLiimit] = useState(10);
    const [search, setSearch] = useState('');
    const [multiselectValueCategories, setMultiselectValueCategories] = useState<null | Demo.Category[]>(null);

    useEffect(() => {
        sendValueToParent()
    }, [multiselectValueCategories])

    const {categories, loading, meta} = useFetchCategories(page, limit, search)

    const itemTemplate = (option: Demo.Category) => {
        return (
            <div className="flex align-items-center">
                <span className="ml-2">{option.name}</span>
            </div>
        );
    };

    const handleFilterCtageories = (event: MultiSelectFilterEvent) => {
        let filterCategories = categories.filter((item) => item.name.toLocaleLowerCase().includes(event.filter.toLocaleLowerCase()));
        if(filterCategories.length <= 2) {
            setSearch(event.filter);
        }
    }

    const sendValueToParent = () => {
        if (multiselectValueCategories) {
            onValueReceivedCategories(multiselectValueCategories);
        }
    };

    return ( 
        <>
        <label className="mb-3">Categoría</label>
        {
            !loading ?
                <MultiSelect
                    value={multiselectValueCategories}
                    onChange={ (e) => setMultiselectValueCategories(e.value) }
                    options={categories}
                    itemTemplate={itemTemplate}
                    optionLabel="name"
                    placeholder="Escoja las categorías"
                    filter
                    onFilter={ handleFilterCtageories }
                    className="multiselect-custom w-full"
                    display="chip"
                />
            :
                <div className="flex justify-content-center align-items-center">
                    <i className="pi pi-spin pi-spinner mx-auto" style={{ fontSize: '2rem' }}></i>
                </div>
        }
        
        </>
     );
}

export default MultiSelectCategories;