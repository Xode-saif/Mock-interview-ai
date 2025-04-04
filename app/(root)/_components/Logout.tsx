"use client"
import {  logoutUser } from '@/lib/actions/auth.action'
import { useRouter } from 'next/navigation'


const Logout = () => {
    const router = useRouter();

    const handleLogout = async()=>{
      try {
        await logoutUser();
        router.replace('/sign-in')
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <div>
        {/* { isAuthenticate && <button onClick={handleLogout} className='btn-primary'>Logout</button>} */}
        <button onClick={handleLogout} className='btn-primary'>Logout</button>
    </div>
  )
}

export default Logout