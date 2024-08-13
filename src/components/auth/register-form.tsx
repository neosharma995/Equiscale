'use client'

import Link from 'next/link'
import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema } from '@/utils'
import { Register } from '@/server'
import { Button, Social, FormError, FormSuccess } from '@/components'

export const RegisterForm = () => {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError('')
        setSuccess('')
        // calling for server action (register)
        startTransition(() => {
            Register(values).then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
        })
    }

    return (
        <>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            id="name"
                            {...form.register('name')}
                            placeholder="Enter Your Name"
                            type="text"
                            disabled={isPending}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {form.formState.errors.name && (
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            {...form.register('email')}
                            placeholder="Enter Your Email ID"
                            type="email"
                            disabled={isPending}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {form.formState.errors.email && (
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            {...form.register('password')}
                            placeholder="Enter Your Password"
                            type="password"
                            disabled={isPending}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {form.formState.errors.password && (
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            {...form.register('confirmPassword')}
                            placeholder="Confirm Your Password"
                            type="password"
                            disabled={isPending}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {form.formState.errors.confirmPassword && (
                            <p className="text-red-500 text-sm">
                                {form.formState.errors.confirmPassword.message}
                            </p>
                        )}
                    </div>
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit">
                    Register
                </Button>
            </form>
            <div>
                <Social />
            </div>
            <div>
                <p>Already have an account?</p>
                <Link href="/auth/login">
                    <p>Login</p>
                </Link>
            </div>
        </>
    )
}
