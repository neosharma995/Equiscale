'use server'
import * as z from 'zod'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { RegisterSchema } from '@/utils'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
export const Register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values)

    if (!validateFields.success) {
        return { error: 'Invalid fields!' }
    }
    const { name, email, password } = validateFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    //checks if user already exists
    const existingUser = await getUserByEmail(email)

    if (existingUser) {
        return {
            error: 'Email already in use!',
        }
    }

    //if user doesn't exist
    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    })

    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )
    return {
        success: 'Confirmation Email Sent!',
    }
}
