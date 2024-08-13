'use server'

import * as z from 'zod'

import { ResetSchema } from '@/utils'
import { getUserByEmail } from '@/data/user'
import { sendResetPasswordEmail } from '@/lib/mail'
import { generateResetPasswordToken } from '@/lib/tokens'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid email!' }
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
        return { error: 'This email is not linked to any account!' }
    }

    const passwordResetToken = await generateResetPasswordToken(email)

    await sendResetPasswordEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return { success: 'Email sent!' }
}
