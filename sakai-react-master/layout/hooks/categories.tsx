import { useEffect, useState } from 'react';
import axios from '~/config';
interface InputValue {
  name: string;
  id: string;
}
export const useFetchCategories = (page: number, limit: number, search: string, submitted : boolean = false) => {
  const [state, setState] = useState<{ categories: InputValue[]; loading: boolean; meta: any }>({ categories: [], loading: true, meta: {} });
  useEffect(() => {
    if(submitted) return;
  
    getCategories();

    const modal = document.querySelector('#new-category');
    if(modal) {
      modal.addEventListener('categorySaved', getCategories);
      return () => {
        modal.removeEventListener('categorySaved', getCategories);
      };
    }
      

  }, [page, limit, search, submitted]);

  const getCategories = () => {
    const query = {
      page: page,
      limit: limit,
      search: search,
    }
    axios.get(`/api/categories`,{
      params: query
    })
    .then( response => {
        setState({meta: response.data.meta, categories: response.data.categories, loading: false});
    }).catch(e => {
        console.warn(e);
        setState({categories: [], loading: false, meta:{}});
    });
  }
  return state;
};
