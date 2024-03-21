/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState, useRef, RefObject } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '~/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useAuth } from '~/layout/hooks/auth';
import { Toast } from 'primereact/toast';
const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [shouldRemember, setShouldRemember] = useState<boolean>(false)
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter()
    const [errors, setErrors] = useState<any>([])
    const [status, setStatus] = useState<string | null>(null);
    const toast = useRef(null);

    const { login, submitted } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const submitForm = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
            toast
        })
    }

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    return (
        <>
            <Toast ref={toast} position="top-right" />
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center">
                    <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}
                    >
                        <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                            <div className="text-center mb-5">
                                {/* <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" /> */}
                                <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido!</div>
                                <span className="text-600 font-medium">Inicia sesión para continuar</span>
                            </div>
                            <form onSubmit={ submitForm }>
                                <div>
                                    <div className='mb-5'>
                                        <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                            Correo
                                        </label>
                                        <InputText aria-describedby="username-help" required onChange={(e) => setEmail(e.target.value)} id="email1" type="text" placeholder="admin@admin.com" className="w-full md:w-30rem" style={{ padding: '1rem' }} />
                                        <div>
                                            <small id="username-help" className="p-error">
                                                {errors.email}
                                            </small>
                                        </div>
                                    </div>
                                    
                                    <div className='mb-5'>
                                        <label  htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                            Contraseña
                                        </label>
                                        <Password aria-describedby="password-help" required inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" toggleMask className="w-full" inputClassName="w-full p-3 md:w-30rem"></Password>
                                        <div>
                                            <small id="password-help" className="p-error">
                                                {errors.password}
                                            </small>
                                        </div>
                                    </div>
                                    

                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputId="rememberme1" checked={shouldRemember} onChange={(e) => setShouldRemember(e.checked ?? false)} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme1">Recuérdame</label>
                                        </div>
                                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                            ¿Has olvidado tu contraseña?
                                        </a>
                                    </div>
                                    <Button type='submit' label="Iniciar sesión" icon="pi pi-check" loading={ submitted } className="w-full p-3 text-xl"/>
                                </div>  
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
