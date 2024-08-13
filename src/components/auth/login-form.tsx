'use client'
import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { Login } from '@/server/actions/login'

import Link from 'next/link'
import { LoginSchema } from '@/utils'
import { Social } from '@/components'

export const LoginForm = () => {
    const searchParams = useSearchParams()
    const urlError =
        searchParams.get('error') === 'OAuthAccountNotLinked'
            ? 'Email is already in use with different provider!'
            : ''

    const [error, setError] = useState<string | undefined>(urlError)
    const [success, setSuccess] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('')
        setSuccess('')
        startTransition(() => {
            Login(values).then((data) => {
                if (data?.error) {
                    setError(data.error)
                } else if (data?.success) {
                    setSuccess(data?.success)
                }
            })
        })
    }

    return (
        <>
            <div>
                <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            {...form.register('email')}
                            disabled={isPending}
                            placeholder="Enter Your Email ID"
                            type="email"
                        />
                        {form.formState.errors.email && (
                            <p>{form.formState.errors.email.message}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            {...form.register('password')}
                            disabled={isPending}
                            placeholder="Enter Your Password"
                            type="password"
                        />
                        <button type="button" disabled={isPending}>
                            <Link href="/auth/reset">Forgot Password?</Link>
                        </button>
                        {form.formState.errors.password && (
                            <p>{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    {error && <p>{error}</p>}
                    {success && <p>{success}</p>}
                    <button type="submit" disabled={isPending}>
                        Login
                    </button>
                </form>
            </div>
            <div>
                <Social />
            </div>
            <div>
                <p>Don&apos;t have an account yet?</p>
                <Link href="/auth/register">
                    <p>Register</p>
                </Link>
            </div>
        </>
    )
}
