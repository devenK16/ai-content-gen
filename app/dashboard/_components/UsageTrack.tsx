"use client"
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { AIOutput, UserSubscription } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';

import { eq } from 'drizzle-orm';
import React, { useState, useEffect, useContext } from 'react';
import { HISTORY } from '../history/page';
import { TotalUsageContext } from '@/app/(context)/TotalUsageContext';
import { UserSubscriptionContext } from '@/app/(context)/UserSubscriptionContext';
import { UpdateCreditUsageContext } from '@/app/(context)/UpdateCreditUsageContext';

function UsageTrack() {

  const { user } = useUser();
  const { totalUsage, setTotalUsage } = useContext(TotalUsageContext);
  const { userSubscription, setUserSubscription } = useContext(UserSubscriptionContext);
  const { updateCreditUsage, setUpdateCreditUsage } = useContext(UpdateCreditUsageContext);
  const [maxWords, setMaxWords] = useState<number>(10000);

  useEffect(() => {
    if (user) {
      GetData();
      checkUserSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (user && updateCreditUsage) {
      GetData();
    }
  }, [updateCreditUsage, user]);

  const GetData = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.error("User email is undefined");
      return;
    }
    //@ts-ignore
    const result: HISTORY[] = await db.select().from(AIOutput)
      .where(eq(AIOutput.createdBy, email));
    GetTotalUsage(result);
  }

  // Updated function to handle potential undefined email
  const checkUserSubscription = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("User email is undefined");
        setUserSubscription(false);
        setMaxWords(10000);
        return;
      }

      const result = await db.select().from(UserSubscription)
        .where(eq(UserSubscription.email, email));
      
      if (result && result.length > 0 && result[0].active) {
        setUserSubscription(true);
        setMaxWords(100000);
      } else {
        setUserSubscription(false);
        setMaxWords(10000);
      }
    } catch (error) {
      console.error("Error checking user subscription:", error);
      setUserSubscription(false);
      setMaxWords(10000);
    }
  }

  const GetTotalUsage = (result: HISTORY[]) => {
    let total: number = 0;
    result.forEach(element => {
      total = total + Number(element.aiResponse?.length);
    });
    setTotalUsage(total);
  }

  return (
    <div className='m-5'>
      <div className='bg-primary text-white p-3 rounded-lg'>
        <h2 className='font-medium'>Credits</h2>
        <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
          <div className='h-2 bg-white rounded-full'
            style={{
              width: (totalUsage / maxWords) * 100 + '%',
            }}>

          </div>
        </div>
        <h2 className='text-sm my-2'>{totalUsage}/{maxWords} credit used</h2>
      </div>
      <Button variant={'secondary'} className='w-full mt-5 text-primary'>Upgrade</Button>
    </div>

  );
}

export default UsageTrack;

