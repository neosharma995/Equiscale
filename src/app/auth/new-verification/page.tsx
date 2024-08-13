import { Suspense } from 'react'
import NewVerificationForm from '@/components/auth/new-verification-form'

const NewVerificationPage = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <NewVerificationForm />
            </Suspense>
        </div>
    )
}

export default NewVerificationPage
