import dynamic from "next/dynamic";
import Head from "next/head";

const CalendarCard = dynamic(() => import("@/components/CalendarPage/CalendarCard"), { ssr: false });

export default function CalendarPage() {
  return (
    <>
      <Head>
        <title>Calendar - Dental Lens</title>
      </Head>
      <div>
        <CalendarCard />
      </div>
    </>
  );
}
