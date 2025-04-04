"use client"
import { interviewer } from '@/constants';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
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

const Agent = ({userName,userId,type,interviewId,questions}:AgentProps) => {
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


        const onSpeechStart = ()=> setIsSpeaking(true);
        const onSpeechEnd = ()=> setIsSpeaking(false);
        const onError = (error:Error)=> console.log('Error',error); 

        vapi.on('call-start',onCallStart);
        vapi.on('call-end',onCallEnd);
        vapi.on('message',onMessage);
        vapi.on('speech-start',onSpeechStart);
        vapi.on('speech-end',onSpeechEnd);
        vapi.on('error',onError);

        return ()=>{
            vapi.off('call-start',onCallStart);
            vapi.off('call-end',onCallEnd);
            vapi.off('message',onMessage);
            vapi.off('speech-start',onSpeechStart);
            vapi.off('speech-end',onSpeechEnd);
            vapi.off('error',onError);
        }
    },[])

    const handleGenerateFeedback = async(messages:SavedMessage[])=>{
        console.log('Generate feedback here.')

        //TODO:create a server action that generate feedback
        const {success, id} = {
            success:true,
            id:'feedback-id'
        }

        if(success && id){
            router.push(`/interview/${interviewId}/feedback`)
        }else{
            console.log('Error saving in feedback')
            router.push('/')
        }
    }

    useEffect(()=>{
        if(callStatus === CallStatus.FINISHED){
            if(type === 'generate'){
                router.push('/');
            }else{
                handleGenerateFeedback(messages)
            }
        }
        
    },[messages,callStatus,type,userId] )

    //handling start of the call
    const handleCall = async()=>{
        setCallstatus(CallStatus.CONNECTING);

        if(type === 'generate'){
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
                variableValues:{
                    username:userName,
                    userid:userId,
                }
            })
        }else{
            let formattedQuestions = '';

            if(questions){
                formattedQuestions = questions.map((question) => `-${question}`).join('\n')
            }
            await vapi.start(interviewer,{
                variableValues:{
                    questions:formattedQuestions
                }
            })
        }
        
    }
    //handle end of the call
    const handleDisconnect = async()=>{
        setCallstatus(CallStatus.FINISHED);

        vapi.stop();
    }

    const latestMessage = messages[messages.length-1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
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
            <div className='card-border flex flex-col sm:flex-row'>
                <div className='card-content w-full'>
                    <Image src="/user-avatar.png" alt='user avatar' width={539} height={539} className='rounded-full object-cover size-[120px]'/>
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>

        {messages.length>0 && (
            <div className='transcript-border'>
                <div className='transcript'>
                    <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
                        {latestMessage}
                    </p>
                </div>
            </div>
        )}

        <div className='w-full flex justify-center mt-8'>
            {callStatus !== "ACTIVE" ? (
                <button className='relative btn-call' onClick={()=>handleCall()}>
                    <span className={cn(`absolute animate-ping rounded-all opacity-75`,callStatus!=='CONNECTING' && 'hidden')}/>

                    <span className=''>
                        {isCallInactiveOrFinished ? 'Call' : '. . .'}
                    </span>
                </button>
            ) : (
                <button className='btn-disconnect' onClick={()=>handleDisconnect()}>
                    End
                </button>
            )}
        </div>
    </>
  )
}

export default Agent