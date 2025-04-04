import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logout from './Logout'
import { isAuthenticated } from '@/lib/actions/auth.action'

const Nav = async() => {
    const isAuth = await isAuthenticated();
  return (
    <nav className='flex justify-between'>
        <Link href="/" className='flex items-center gap-2'>
          <Image src='/logo.svg' width={38} height={32} alt="logo"/>
          <h2 className='text-primary-100'>PrepWise</h2>
        </Link>    
        {isAuth && <Logout/> }
    </nav>
  )
}

export default Nav