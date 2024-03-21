import { useEffect, useState } from 'react';
import { Demo } from '~/types/types';
import { getRolsService } from '~/demo/service/RolService';

export const useFetchRoles = (page: number, limit: number, search: string, submitted: boolean) => {
  const [state, setState] = useState<{ roles: []; loadingRoles: boolean; metaRoles: any }>({ roles: [], loadingRoles: true, metaRoles: {} });
  useEffect(() => {
    if(submitted) return;
  
    getRoles();

    const modal = document.querySelector('#new-rol');
    if(modal) {
      modal.addEventListener('rolesaved', getRoles);
      return () => {
        modal.removeEventListener('rolesaved', getRoles);
      };
    }
      

  }, [page, limit, search, submitted]);

  const getRoles = async () => {
    try {
        const data = await getRolsService (page, limit, search); 
        setState({metaRoles: data.meta, roles: data.roles, loadingRoles: false});
    } catch(err) {
       console.log(err);
       setState({roles: [], loadingRoles: false, metaRoles:{}});
    }
  }
  return state;
};
