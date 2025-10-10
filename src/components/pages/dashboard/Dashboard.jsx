import HrDashboard from './HrDashboard';
import CandidateDashboard from './CandidateDashboard';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          <CandidateDashboard/>
          {/* <ScheduleSession/> */}
          {/* <PracticeTest/> */}
        </div>
      </section>
    </>
  );
}
