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
        <div className='overflow-x-auto mt-5'>
            <table className='w-full min-w-[700px]'>
                <thead>
                    <tr className='bg-secondary text-left'>
                        <th className='py-3 px-3 font-bold'>TEMPLATE</th>
                        <th className='py-3 px-3 font-bold'>AI RESP</th>
                        <th className='py-3 px-3 font-bold'>DATE</th>
                        <th className='py-3 px-3 font-bold'>WORDS</th>
                        <th className='py-3 px-3 font-bold'>COPY</th>
                    </tr>
                </thead>
                <tbody>
                    {HistoryList.map((item:HISTORY, index:number) => (
                        <tr key={index} className='border-b'>
                            <td className='py-3 px-3'>
                                <div className='flex gap-2 items-center'>
                                    <Image src={GetTemplateName(item?.templateSlug)?.icon} width={25} height={25} alt='icon' />
                                    <span>{GetTemplateName(item.templateSlug)?.name}</span>
                                </div>
                            </td>
                            <td className='py-3 px-3'>
                                <div className='line-clamp-3 max-w-[200px]'>{item?.aiResponse}</div>
                            </td>
                            <td className='py-3 px-3'>{item.createdAt}</td>
                            <td className='py-3 px-3'>{item?.aiResponse.length}</td>
                            <td className='py-3 px-3'>
                                <CopyButton aiResponse={item.aiResponse} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default History