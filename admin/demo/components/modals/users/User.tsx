/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useRef, useState,  RefObject} from 'react';
import { Demo } from '../../../../types/types';
import axios from '~/demo/service/config';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
const User = ({ user, setUserDialog, userDialog, hideDialog, updateUser, isEdit, roles, submitted, setSubmitted}: {
    user: Demo.User;
    setUserDialog: (show: boolean) => void;
    userDialog: boolean;
    hideDialog: () => void;
    updateUser: (user: Demo.User) => void;
    isEdit: boolean;
    roles: [];
    submitted: boolean;
    setSubmitted: (submitted: boolean) => void;
  }) => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        if(role) {
            let _user = { ...user };
            _user['role'] = role;
            updateUser(_user);
        }
    },[role])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let _user = { ...user };
        _user[name] = value
        updateUser(_user);
    };

    const save = () => {
        setSubmitted(true);
        axios.post(`/admin/users`, user)
        .then( response => {
          setTimeout(() => {
            setSubmitted(false);
            setUserDialog(false);
          }, 500)
        }).catch(e => {
            console.warn(e);
            setSubmitted(false);
        });
    }

    const update = () => {
        setSubmitted(true);
        axios.put(`/admin/users/${user.id}`, user)
        .then( response => {
          setTimeout(() => {
            setSubmitted(false);
            setUserDialog(false);
          }, 500)
        }).catch(e => {
            console.warn(e);
            setSubmitted(false);
        });
    }

    const onCheckboxChange = (e: CheckboxChangeEvent) => {
        const {name, value } = e.target;
        let _user = { ...user };
        _user[name] = !value;
        updateUser(_user);
    };

    const UserDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            {
                isEdit 
                ?
                <Button loading={ submitted } label="Actualizar" icon="pi pi-check" text onClick={update} />
                :
                <Button loading={ submitted } label="Guardar" icon="pi pi-check" text onClick={save} />
        
            }
            
        </>
    );

    return (

        <Dialog style={{width: '90vw'}} visible={userDialog} header="Detalles del usuario" modal className="p-fluid" footer={UserDialogFooter} onHide={hideDialog}>
            {/* <img src={`${typeof user.image === 'string' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/categories/${user.image}` : 'https://placehold.co/500x500?text='+user.name}`} alt={user.name} width="150" className="mt-0 mx-auto mb-5 block shadow-2" /> */}
            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Nombre</label>
                    <InputText
                        id="name"
                        value={user.name}
                        onChange={onInputChange}
                        required
                        name="name"
                        autoFocus
                        className={classNames({
                            'p-invalid': submitted && !user.name
                        })}
                    />
                    {submitted && !user.name && <small className="p-invalid">El nombre es requerido.</small>}
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="name">Correo</label>
                    <InputText
                        id="email"
                        value={user.email}
                        onChange={onInputChange}
                        required
                        name="email"
                        className={classNames({
                            'p-invalid': submitted && !user.email
                        })}
                    />
                    {submitted && !user.email && <small className="p-invalid">El email es requerido.</small>}
                </div>
                {
                    isEdit ? ''
                    : 
                    <>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Contraseña</label>
                            <InputText
                                id="password"
                                value={user.password}
                                onChange={onInputChange}
                                name="password"
                            />
                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="name">Contraseña</label>
                            <InputText
                                id="password_confirmation"
                                value={user.password_confirmation}
                                onChange={onInputChange}
                                name="password_confirmation"
                            />
                        </div>
                    </>
                }
               
            </div>

            <div className="grid">
                <div className="col-12 md:col-6">
                    <div className="field-checkbox">
                        <Checkbox inputId="checkOption1" name="state" value={user.state}  checked={ user.state }  onChange={onCheckboxChange} />
                        <label htmlFor="checkOption1">Está activo</label>
                    </div>
                </div>
            </div> 
            <Dropdown value={role} onChange={(e) => setRole(e.value)} options={roles} optionLabel="name" placeholder="Select" />
        </Dialog>

    )
}

export default User;