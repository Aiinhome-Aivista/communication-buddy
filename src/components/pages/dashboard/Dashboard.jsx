import HrDashboard from './HrDashboard';
import CandidateDashboard from './CandidateDashboard';

export default function Dashboard() {
  const role = typeof window !== 'undefined' ? sessionStorage.getItem('userRole') : null;
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          {role === 'hr' ? <HrDashboard /> : <CandidateDashboard />}
          {/* <ScheduleSession/> */}
          {/* <PracticeTest/> */}
        </div>
      
      </section>
    </>
  );
}
