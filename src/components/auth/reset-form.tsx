'use client'
import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ResetSchema } from '@/utils'
import { reset } from '@/server'

import { Button } from '@/components'
import { FormError } from '@/components'
import { FormSuccess } from '@/components'

export const ResetForm = () => {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError('')
        setSuccess('')
        startTransition(() => {
            reset(values).then((data) => {
                if (data?.error) {
                    setError(data.error)
                } else if (data?.success) {
                    setSuccess(data?.success)
                }
            })
        })
    }

    return (
        <div>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        {...form.register('email')}
                        disabled={isPending}
                        placeholder="Enter Your Email ID"
                        type="email"
                    />
                    <p>{form.formState.errors.email?.message}</p>
                </div>

                <FormError message={error} />
                <FormSuccess message={success} />
                <Button disabled={isPending} type="submit">
                    Send reset email
                </Button>
            </form>
        </div>
    )
}
