import Templates from '@/app/(data)/Templates'
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { AIOutput } from '@/utils/schema'
import { currentUser } from '@clerk/nextjs/server'
import { desc, eq } from 'drizzle-orm'
import Image from 'next/image'
import React from 'react'
import { TEMPLATE } from '../_components/TemplateListSection'
import CopyButton from './_components/CopyButton'

export interface HISTORY{
    id:Number,
    formData:string,
    aiResponse:string,
    templateSlug:string,
    createdBy:string,
    createdAt:string
}

async function History() {
    const user = await currentUser();

    {/* @ts-ignore */}
    const HistoryList:HISTORY[] = await db.select().from(AIOutput).where(eq(AIOutput?.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(AIOutput.id));

    const GetTemplateName = (slug:string) => {
        const template:TEMPLATE|any = Templates?.find((item) => item.slug == slug)
        return template;
    }

    return (
        <div className='m-2 sm:m-5 p-3 sm:p-5 border rounded-lg bg-white'>
            <h2 className='font-bold text-2xl sm:text-3xl'>History</h2>
            <p className='text-gray-500 text-sm sm:text-base'>Search your previously generated AI content</p>
            
            <div className='hidden sm:grid grid-cols-7 font-bold bg-secondary mt-5 py-3 px-3'>
                <h2 className='col-span-2'>TEMPLATE</h2>
                <h2 className='col-span-2'>AI RESP</h2>
                <h2>DATE</h2>
                <h2>WORDS</h2>
                <h2>COPY</h2>
            </div>
            
            {HistoryList.map((item:HISTORY, index:number) => (
                <div key={index} className='my-4 sm:my-5 py-2 sm:py-3 px-2 sm:px-3 border-b'>
                    <div className='sm:hidden font-semibold mb-2'>{GetTemplateName(item.templateSlug)?.name}</div>
                    <div className='sm:grid sm:grid-cols-7 flex flex-col gap-2'>
                        <div className='sm:col-span-2 flex gap-2 items-center'>
                            <Image src={GetTemplateName(item?.templateSlug)?.icon} width={25} height={25} alt='icon' className='hidden sm:inline' />
                            <span className='hidden sm:inline'>{GetTemplateName(item.templateSlug)?.name}</span>
                        </div>
                        <div className='sm:col-span-2 line-clamp-3 mr-3'>{item?.aiResponse}</div>
                        <div className='text-sm text-gray-500 sm:text-base sm:text-black'>{new Date(item.createdAt).toLocaleDateString()}</div>
                        <div>{item?.aiResponse.length}</div>
                        <div>
                            <CopyButton aiResponse={item.aiResponse} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default History