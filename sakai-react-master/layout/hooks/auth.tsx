import useSWR, { SWRResponse } from 'swr';
import axios from '~/config';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Demo } from '~/types/demo';


export const useAuth = ({ middleware, redirectIfAuthenticated } : {
    middleware ?: 'guest' | 'auth';
    redirectIfAuthenticated: string;
  }) =>  {
    const router = useRouter();
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { data: user, error, mutate }: SWRResponse<Demo.User> = useSWR('/api/user', () => 
    axios
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response?.status !== 409) throw error;

        router.push('/verify-email');
      })
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const register = async ({ setErrors, ...props }: Demo.RegisterProps) => {
        await csrf();
    
        setErrors([]);
    
        axios
          .post('/register', props)
          .then(() => mutate())
          .catch(error => {
            if (error.response?.status !== 422) throw error;
    
            setErrors(error.response?.data.errors);
          })
    };

    const login = async ({ setErrors, setStatus, toast, ...props }: Demo.LoginProps) => {
        setSubmitted(true);
        await csrf()

        setErrors([])
        setStatus(null)
        axios
            .post('/login', props)
            .then(() => {
                toast.current.show({severity:'success', summary: 'Success', detail:'Inicio de sesión exitoso', life: 3000});
                setSubmitted(false);
                mutate()
            })
            .catch(error => {
                if (error.response.status !== 422) throw error;
                setSubmitted(false);
                setErrors(error.response.data.errors);
            })
    }

    const forgotPassword = async ({ setErrors, setStatus, email }: Demo.ForgotPasswordProps) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const resetPassword = async ({ setErrors, setStatus, ...props }: Demo.ResetPasswordProps) => {
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/reset-password', {   
               // token: router.query.token,
                ...props
            })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }


    const resendEmailVerification = ({ setStatus }: {setStatus: (status: string | null) => void}) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

       if(window.location.pathname != '/auth/login') window.location.pathname = '/auth/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)
        if (
            window.location.pathname === '/verify-email' &&
            user?.email_verified_at
        )
            router.push(redirectIfAuthenticated)
        if (middleware === 'auth' && error) logout()

    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
        submitted
    }
}
