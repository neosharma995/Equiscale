import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`
    await resend.emails.send({
        from: 'equiScale@resend.dev',
        to: email,
        subject: 'Reset your password',
        text: `Click this link to reset your password: ${resetLink}`,
    })
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

    await resend.emails.send({
        from: 'equiScale@resend.dev',
        to: email,
        subject: 'Verify your email address',
        text: `Click this link to verify your email: ${confirmLink}`,
    })
}
