
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
// import Logout from './_components/Logout'
// import { cookies } from 'next/headers'

const RootLayout = async({children}:{children:React.ReactNode}) => {
  // const cookieStore = await cookies();
  // const isAuth = cookieStore.has('session');
  return (
    <div className='root-layout'>
      <nav className='flex justify-between'>
        <Link href="/" className='flex items-center gap-2'>
          <Image src='/logo.svg' width={38} height={32} alt="logo"/>
          <h2 className='text-primary-100'>PrepWise</h2>
        </Link>    
        {/* {isAuth && <Logout/> } */}
      </nav>
      {children}
    </div>
  )
}

export default RootLayout