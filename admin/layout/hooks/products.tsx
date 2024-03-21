import { useEffect, useState } from 'react';
import axios from '~/demo/service/config';
import { Demo } from '../../types/types';
interface State {
  products: Demo.Product[];
  loading: boolean;
  meta: any; 
}
export const useFetchProducts = (page: number, limit: number, search: string) => {
  const [state, setState] = useState<State>({products:[], loading: true, meta:{}});

  useEffect(() => {
    const query = {
      page: page,
      limit: limit,
      search: search,
      brand_id: '',
      collection_id: ''
    }
        axios.get(`/api/products`,{
          params: query
        })
        .then( response => {
            setState({meta: response.data.meta, products: response.data.products, loading: false});
        }).catch(e => {
            console.warn(e);
            setState({products: [], loading: false, meta:{}});
          });
  }, [page, limit, search]);

  return state;
};
