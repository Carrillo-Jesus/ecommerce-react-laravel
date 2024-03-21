import { useEffect, useState } from 'react';
import { Demo } from '~/types/types';
import { getUsersService } from '~/demo/service/UserService';
export const useFetchUsers = (page: number, limit: number, search: string, submitted: boolean) => {
  const [state, setState] = useState<{ users: Demo.User[]; loading: boolean; meta: any }>({ users: [], loading: true, meta: {} });
  useEffect(() => {
    if(submitted) return;
    getUsers();
  }, [page, limit, search, submitted]);

  const getUsers = async () => {
    try {
        const data = await getUsersService(page, limit, search); 
        setState({meta: data.meta, users: data.users, loading: false});
    } catch(err) {
       console.log(err);
       setState({users: [], loading: false, meta:{}});
    }
  }
  return state;
};
