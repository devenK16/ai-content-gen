import Header from "../_components/Header";
import SideNav from "../_components/SideNav";
import { UserProfile } from "@clerk/nextjs";
import React from "react";

function Settings() {
    return (
        <div className="flex  h-full items-center justify-center pt-5">
            <UserProfile routing="hash" />
        </div>
    );
}
    
export default Settings;