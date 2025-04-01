"use client"
import { cn } from '@/lib/utils';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

enum CallStatus{
    INACTIVE='INACTIVE',
    CONNECTING='CONNECTING',
    ACTIVE='ACTIVE',
    FINISHED='FINISHED'
}

interface SavedMessage{
    role:'user'|'system'|'assistant';
    content:string;
}

const Agent = ({userName,userId,type}:AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus,setCallstatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages,setMessages] = useState<SavedMessage[]>([]);

    useEffect(()=>{
        const onCallStart = () =>setCallstatus(CallStatus.ACTIVE)
        const onCallEnd = ()=> setCallstatus(CallStatus.FINISHED);
        const onMessage = (message:Message)=>{
            if(message.type ==='transcript' && message.transcriptType === 'final'){
                const newMessage = {role:message.role, content:message.transcript}

                setMessages((prev)=> [...prev, newMessage]);
            }
        }
    },[])

    // const callStatus = CallStatus.INACTIVE
    // const isSpeaking = true;
    // const messages = ['whats your name', 'my name is saif, nice to meet you ']
    // const lastMessage = messages[messages.length-1];
  return (
    <>
        <div className='call-view'>
            <div className='card-interviewer'>
                <div className='avatar'>
                    <Image src='/ai-avatar.png' alt='vapi' width={65} height={54} className="object-cover"/>
                    {isSpeaking && <span className='animate-speak'/>}
                </div>
                <h3>AI Interviewer</h3>
            </div>
            <div className='card-border'>
                <div className='card-content'>
                    <Image src="/user-avatar.png" alt='user avatar' width={539} height={539} className='rounded-full object-cover size-[120px]'/>
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>

        {messages.length>0 && (
            <div className='transcript-border'>
                <div className='transcript'>
                    <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
                        {lastMessage}
                    </p>
                </div>
            </div>
        )}

        <div className='w-full flex justify-center mt-8'>
            {callStatus !== "ACTIVE" ? (
                <button className='relative btn-call'>
                    <span className={cn(`absolute animate-ping rounded-all opacity-75`,callStatus!=='CONNECTING' & 'hidden')}/>

                    <span className=''>
                        {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '. . .'}
                    </span>
                </button>
            ) : (
                <button className='btn-disconnect'>
                    End
                </button>
            )}
        </div>
    </>
  )
}

export default Agent