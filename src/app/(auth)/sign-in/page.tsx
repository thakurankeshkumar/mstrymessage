'use client'

import { useSession, signIn, signOut } from "next-auth/react";


export default function Component() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button className="bg-orange-500 px-3 py-1 m-4 rounded-2xl" onClick={() => signOut()}>signOut</button>
            </>
        )
    }

    return (
        <>
            Not signed In <br />
            <button className="bg-orange-500 px-3 py-1 m-4 w-fit rounded" onClick={() => signIn()}>Sign In</button>
        </>
    )

}