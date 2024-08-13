import { Suspense } from 'react'
import { NewPasswordForm } from '@/components'

const NewPasswordPage = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <NewPasswordForm />
            </Suspense>
        </div>
    )
}

export default NewPasswordPage
