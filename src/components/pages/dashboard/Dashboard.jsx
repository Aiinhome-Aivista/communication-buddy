import HrCandidateDashboard from './HrCandidateDashboard';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          <HrCandidateDashboard />
          {/* <ScheduleSession/> */}
          {/* <PracticeTest/> */}
        </div>
      
      </section>
    </>
  );
}
