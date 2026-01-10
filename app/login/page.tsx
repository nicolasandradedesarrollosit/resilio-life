import { cookies } from 'next/headers'
import LoginClient from './LoginClient'

export default async function LogInPage() {
    const cookieStore = await cookies()
    const hasAuthCookie = cookieStore.has('user_role')
    
    return <LoginClient hasAuthCookie={hasAuthCookie} />
}

