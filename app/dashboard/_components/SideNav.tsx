"use client"
import { FileClock, Home, Settings, WalletCards , X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'
import UsageTrack from './UsageTrack'

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideNav = ({ isOpen, onClose } : SideNavProps) => {
  const MenuList=[
    {
      name:"Home",
      icon: Home,
      path:"/dashboard"
    },
    {
      name:"History",
      icon: FileClock,
      path:"/dashboard/history"
    },
    {
      name:"Billing",
      icon: WalletCards,
      path:"/dashboard/billing"
    },
    {
      name:"Settings",
      icon: Settings,
      path:"/dashboard/settings"
    }
  ]
  const path=usePathname();
  useEffect(()=>{
    
  })
  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 h-screen p-5 shadow-sm border`}>
      <div className="flex justify-between items-center mb-6">
        <div className='flex justify-center'>
          <Image src="/logo.svg" alt="logo" width={100} height={100}/>
        </div>
        <button onClick={onClose} className="md:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>
      <hr className='my-6 border'/>
      <div className='mt-3'>
            {MenuList.map((menu,index)=>(
                <Link href={menu.path}>
                    <div className={`flex gap-2 mb-2 p-3
                    hover:bg-primary hover:text-white rounded-lg
                    cursor-pointer items-center
                    ${path==menu.path&&'bg-primary text-white'}
                    `}>
                        <menu.icon className='h-6 w-6'/>
                        <h2 className='text-lg'>{menu.name}</h2>
                    </div>
                </Link>
            ))}
        </div>
        <div className='absolute bottom-10 left-0 w-full'>
            <UsageTrack/>
        </div>
    </div>

  )
}

export default SideNav