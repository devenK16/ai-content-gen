import { UserButton } from '@clerk/nextjs'
import { Search, SearchIcon } from 'lucide-react'
import { Menu } from 'lucide-react'
import React from 'react'

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <div className='p-5 shadow-sm border-b-2 bg-white flex justify-between items-center'>
      {/* <div className='flex gap-2 items-center p-2 border rounded-md max-w-lg bg-white'>
        <Search />
        <input type="text" placeholder='Search...' className='outline-none' />
      </div> */}

      <button onClick={onMenuClick} className="md:hidden">
        <Menu className="h-6 w-6" />
      </button>

      <div className='flex gap-5 items-center'>
        <h2 className='bg-primary rounded-lg text-xs text-white p-1'> 🔥 Upgrade plan just for $9.99/Month</h2>
        <UserButton />
      </div>
    </div>
  )
}

export default Header