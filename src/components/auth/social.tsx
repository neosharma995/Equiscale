'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { useSearchParams } from 'next/navigation'

export const Social = () => {
    const searchParams = useSearchParams()

    const callbackUrl = searchParams.get('callbackUrl')

    const onClick = (provider: 'google') => {
        signIn(provider, {
            callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
    }

    return (
        <div>
            <Button onClick={() => onClick('google')}>
                <FcGoogle />
            </Button>
        </div>
    )
}
