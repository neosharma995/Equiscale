'use client'

import { useCallback, useEffect, useState } from 'react'
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from 'next/navigation'

import { newVerification } from '@/server'
import { FormError } from '@/components'
import { FormSuccess } from '@/components'

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const searchParams = useSearchParams()

    const token = searchParams.get('token')

    const onSubmit = useCallback(() => {
        if (success || error) return

        if (!token) {
            setError('Missing token!')
            return
        }

        newVerification(token)
            .then((data) => {
                setSuccess(data.success)
                setError(data.error)
            })
            .catch(() => {
                setError('Something went wrong!')
            })
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <>
            <div>Authentication</div>
            <div>
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                {!success && <FormError message={error} />}
            </div>
        </>
    )
}

export default NewVerificationForm
