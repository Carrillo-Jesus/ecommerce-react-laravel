import axios from '~/demo/service/config';

export const getRolsService = (page: number, limit: number, search: string) => {
    const query = {
      page: page,
      limit: limit,
      search: search,
    }
    return axios.get(`/admin/roles`, { 
      params: query
    })
    .then( response => {
        return { meta: response.data.meta, roles: response.data.roles, loading: false };
    }).catch(e => {
        console.warn(e);
        return { roles: [], loading: false, meta:{} } ;
    });
  }