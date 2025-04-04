import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import InterviewCard from "../components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import{getInterviewsByUserId, getLatestInterviews} from "@/lib/actions/general.action"

export default async function Home() {
  const user = await getCurrentUser();
  console.log("user",user);
  
  // const userInterviews = await getInterviewsByUserId(user?.id!)
  // const latestInterviews = await getLatestInterviews({userId:user?.id!},)
  //optimizing above two line 
  const [userInterviews,latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({userId:user?.id!},)
  ])

  console.log("userInterviews",userInterviews);
  console.log("latestInterviews",latestInterviews);
  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">Practice on real interview questios & get instant feedback</p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>

        </div>
          <Image src='/robot.png' width={400} height={400} alt="robot_dude"
            className=" max-sm:hidden"/>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {
            hasPastInterviews ? (
              userInterviews?.map((interview)=>(
                <InterviewCard key={interview.id} {...interview}/>
              ))
            ):(
              <p>You haven&apos;t take any interview yet</p>
            )
          }
        </div> 
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
        {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview)=>(
                <InterviewCard key={interview.id} {...interview}/>
              ))
            ):(
              <p>There are no new interview available</p>
            )
          }
        </div>
      </section>
    </>
  );
}
