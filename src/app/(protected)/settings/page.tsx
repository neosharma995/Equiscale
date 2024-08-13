import Logout from '@/app/auth/logout/page'
import { auth, signOut } from '@/auth'

const SettingsPage = async () => {
    const session = await auth()
    return (
        <>
            <div>{JSON.stringify(session)}</div>
            <div>
                <form
                    action={async () => {
                        'use server'
                        await signOut()
                    }}
                >
                    <div>
                        <Logout />
                    </div>
                </form>
            </div>
        </>
    )
}
export default SettingsPage
