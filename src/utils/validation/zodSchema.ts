import * as z from 'zod'

const passwordSchema = z
    .string()
    .min(8, {
        message: 'Password must be at least 8 characters long',
    })
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        {
            message:
                'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
        }
    )

//validates Login
export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Email is Required',
    }),
    password: z.string().min(3, {
        message: 'Password is required',
    }),
})

//validates Registration
export const RegisterSchema = z
    .object({
        name: z
            .string()
            .min(1, {
                message: 'Name is required',
            })
            .max(20, {
                message: 'Name should not exceed 20 characters',
            }),

        email: z.string().email({
            message: 'Email is required',
        }),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    })

//validates reset password
export const ResetSchema = z.object({
    email: z.string().email({
        message: 'Email is required',
    }),
})

//validates new password after reset password
export const NewPasswordSchema = z.object({
    password: z
        .string()
        .min(8, {
            message: 'Password must be at least 8 characters',
        })
        .regex(
            new RegExp(
                '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%&]).{8,32}'
            ),
            {
                message:
                    'Password must contain one uppercase letter, one lowercase letter, one number and one of the following characters: * . ! @ $ % &',
            }
        ),
})
