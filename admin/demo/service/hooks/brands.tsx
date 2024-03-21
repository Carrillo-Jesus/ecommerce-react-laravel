import { useEffect, useState } from 'react';
import axios from '~/demo/service/config';
interface InputValue {
  name: string;
  id: string;
}
export const useFetchBrands = (page: number, limit: number, search: string) => {
  const [state, setState] = useState<{ brands: InputValue[]; loading: boolean; meta: any }>({ brands: [], loading: true, meta: {} });
  useEffect(() => {
    
    getBrands();

    // const modal = document.querySelector('#new-category');
    //   modal.addEventListener('categorySaved', getCategories);
    // return () => {
    //   modal.removeEventListener('categorySaved', getCategories);
    // };

  }, [page, limit, search]);

  const getBrands = () => {
    const query = {
      page: page,
      limit: limit,
      search: search,
    }
    axios.get(`/api/brands`,{
      params: query
    })
    .then( response => {
        setState({meta: response.data.meta, brands: response.data.brands, loading: false});
    }).catch(e => {
        console.warn(e);
        setState({brands: [], loading: false, meta:{}});
    });
  }
  return state;
};
