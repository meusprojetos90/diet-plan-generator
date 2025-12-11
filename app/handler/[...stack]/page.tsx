import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import React from 'react';

export default function Handler(props: any) {
    return (
        <React.Suspense fallback={<div>Loading authentication...</div>}>
            <StackHandler app={stackServerApp} {...props} />
        </React.Suspense>
    );
}
