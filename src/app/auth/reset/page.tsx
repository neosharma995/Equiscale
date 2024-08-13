import { ResetForm } from '@/components/auth/reset-form'
import Link from 'next/link'

const ResetPage = () => {
    return (
        <>
            <div>
                <ResetForm />
            </div>

            <div>
                <Link href="/auth/login">Go Back To Login</Link>
            </div>
        </>
    )
}

export default ResetPage
