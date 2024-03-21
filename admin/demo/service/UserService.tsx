import { Demo } from '~/types/types';
import axios from '~/demo/service/config';

export const getUsersService = (page: number, limit: number, search: string) => {
    const query = {
      page: page,
      limit: limit,
      search: search,
    }
    return axios.get(`/admin/users`,{
      params: query
    })
    .then( response => {
        return { meta: response.data.meta, users: response.data.users, loading: false };
    }).catch(e => {
        console.warn(e);
        return { users: [], loading: false, meta:{} } ;
    });
  }