"use client";
import Header from "./../_components/Header";
import SideNav from "./../_components/SideNav";
import React, { useContext, useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import moment from "moment";
import { UserSubscription } from "@/utils/schema";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { UserSubscriptionContext } from "../../(context)/UserSubscriptionContext";
import { eq } from 'drizzle-orm';


const BillingPage = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const {userSubscription, setUserSubscription} =useContext(UserSubscriptionContext);

  useEffect(() => {
    if (user) {
      checkUserSubscription();
    }
  }, [user]);

  // Updated function to handle potential undefined email
  const checkUserSubscription = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("User email is undefined");
        setUserSubscription(false);
        return;
      }

      const result = await db.select().from(UserSubscription)
        .where(eq(UserSubscription.email, email));
      
      if (result && result.length > 0 && result[0].active) {
        setUserSubscription(true);
      } else {
        setUserSubscription(false);
      }
    } catch (error) {
      console.error("Error checking user subscription:", error);
      setUserSubscription(false);
    }
  };

  const createSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/create-subscription", {});
      initiatePayment(response.data.id);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error("Error creating subscription:", error.message);
    }
  };

  const initiatePayment = (subscriptionId: string) => {
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKeyId) {
      console.error("Razorpay Key ID is not defined");
      setLoading(false);
      return;
    }

    const options = {
      key: razorpayKeyId,
      subscription_id: subscriptionId,
      name: "AI Content Generator",
      description: "Monthly Subscription",
      handler: handlePaymentSuccess,
    };
    // @ts-ignore
    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  const handlePaymentSuccess = async (response: any) => {
    setLoading(false);
    if (
      response &&
      user &&
      user.fullName &&
      user.primaryEmailAddress?.emailAddress
    ) {
      saveSubscription(response?.razorpay_payment_id);
    }
  };

  // Updated function to handle potential undefined email
  const saveSubscription = async (paymentId: string) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("User email is undefined");
        return;
      }

      const existingUser = await db.select().from(UserSubscription)
        .where(eq(UserSubscription.email, email));

      if (existingUser && existingUser.length > 0) {
        // Update existing user
        await db.update(UserSubscription)
          .set({
            active: true,
            paymentId: paymentId,
          })
          .where(eq(UserSubscription.email, email));
      } else {
        // Insert new user
        await db.insert(UserSubscription).values({
          email: email,
          userName: user?.fullName ?? '',
          active: true,
          paymentId: paymentId,
          joinDate: moment().format("DD/MM/yyyy"),
        });
      }

      setUserSubscription(true);
      window.location.reload();
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  };


  return (
    <div className="bg-slate-200 h-screen">
        <div className="p-10">
          <h2 className="font-bold text-3xl text-center">
            Upgrade With Monthly Plan
          </h2>

          <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
              <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12 bg-white">
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Free
                    <span className="sr-only">Plan</span>
                  </h2>

                  <p className="mt-2 sm:mt-4">
                    <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                      {" "}
                      0{" "}
                    </strong>

                    <span className="text-sm font-medium text-gray-700">
                      /month
                    </span>
                  </p>
                </div>

                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">✔️ 10,000 Words/Month</h2>
                  </li>
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">✔️ 50+ Content Templates</h2>
                  </li>
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">
                      ✔️ Unlimited Download & Copy
                    </h2>
                  </li>
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">✔️ 1 Month of History</h2>
                  </li>
                </ul>
                <button
            
                  className={`mt-8 flex items-center gap-2 rounded-full border mx-auto border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 hover:bg-primary hover:text-white focus:outline-none focus:ring active:text-indigo-500 ${userSubscription && "hidden" }`}>
                  Currently Active Plan
                </button>
              </div>
              <div className="rounded-2xl border border-gray-200 p-6 shadow-sm sm:px-8 lg:p-12 bg-white">
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Monthly
                    <span className="sr-only">Plan</span>
                  </h2>

                  <p className="mt-2 sm:mt-4">
                    <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                      {" "}
                      100{" "}
                    </strong>

                    <span className="text-sm font-medium text-gray-700">
                      /month
                    </span>
                  </p>
                </div>

                <ul className="mt-6 space-y-2">
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">✔️ 1,00,000 Words/Month</h2>
                  </li>
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">✔️ 50+ Template Access</h2>
                  </li>
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">
                      ✔️ Unlimited Download & Copy
                    </h2>
                  </li>
                  <li className="flex items-center gap-1 mb-2">
                    <h2 className="text-gray-700">✔️ 1 Year of History</h2>
                  </li>
                </ul>
                <button
                  disabled={loading}
                  onClick={() => createSubscription()}
                  className="mt-8 flex items-center gap-2 rounded-full border mx-auto border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 hover:bg-primary hover:text-white focus:outline-none focus:ring active:text-indigo-500 "
                >
                  {loading && <Loader2Icon className="animate-spin" />}
                  {userSubscription ? "Active Plan" : "Get Started"}
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default BillingPage;