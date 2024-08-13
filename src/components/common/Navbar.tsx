import Link from 'next/link'

export const Navbar = () => {
    return (
        <>
            <div>
                <button className="">
                    <Link href="/auth/login">Login</Link>
                </button>
            </div>
            <div>
                <button className="">
                    <Link href="/auth/register">Get Free Account</Link>
                </button>
            </div>
        </>
    )
}
