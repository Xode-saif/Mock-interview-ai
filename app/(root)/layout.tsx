
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Nav from './_components/Nav'
// import Logout from './_components/Logout'
// import { cookies } from 'next/headers'

const RootLayout = async({children}:{children:React.ReactNode}) => {
  // const cookieStore = await cookies();
  // const isAuth = cookieStore.has('session');
  return (
    <div className='root-layout'>
      <Nav/>
      {children}
    </div>
  )
}

export default RootLayout