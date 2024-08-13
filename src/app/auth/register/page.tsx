import { Suspense } from 'react'
import { RegisterForm } from '@/components'

const RegisterPage = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    )
}

export default RegisterPage
