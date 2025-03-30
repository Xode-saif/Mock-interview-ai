"use server"

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

export async function signUp({params}:{params:SignUpParams}){
    const {uid,name,email} =  await params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists){
            return {
                success:false,
                message:'User already exists. Please sign in instead'
            }
        }

        await db.collection('users').doc(uid).set({
            name,email
        })
        return {
            success:true,
            message:'Account created successfully. Please sign in.'
        }
    } catch (error:any) {
        console.log('Error creating a user',error);

        if(error.code === 'auth/email-already-exists'){
            return {
                success: false, 
                message:'This email is already in use'
            }
        }
        return {
            success:false,
            message:'Failed to create an account '
        }
    }
}

export async function setSessionCookie(idToken:string){
    try{
        const cookieStore = await cookies();
        
        const sessionCookie = await auth.createSessionCookie(idToken,{
            expiresIn:60 * 60 * 24 * 7 * 1000
        })
        cookieStore.set('session',sessionCookie,{
            maxAge:60*60*24*7,
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            path:'/',
            sameSite:'lax'
        })
    }catch(error){
        console.log('Session cookie creation failed',error);
        throw new Error('Authentication failed')
    }
    
}

export async function signIn(params:SignInParams){
    const {email,idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord){
            return{
                success:false,
                message:'User does not exist. Create an account instead'
            }
        }
        await setSessionCookie(idToken);
    } catch (error) {
        console.log(error);
        return {
            sucess:false,
            message:'Failed to log into an account.'
        }
    }
}

export async function getCurrentUser():Promise<User | null>{
    const cookieStore = await cookies();
    
    const sessionCookie = cookieStore.get('session')?.value;
    if(!sessionCookie) return null;

    try {
        //to see wheather we have a valid user
        const decodedClaims = await auth.verifySessionCookie(sessionCookie,true);
        //access user from database
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();

        if(!userRecord.exists) return null;

        return {
           ...userRecord.data(),
           id:userRecord.id 
        } as User
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;   // if we have a user return a true -->boolean value --- !! mark convert in to boolean value
                    // for ex. {name:"saif"}-> !{} => false -> !false=>true
}