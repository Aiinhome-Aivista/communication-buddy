import HrDashboard from './HrDashboard';

export default function Dashboard() {
  return (
    <>
      <section className="dashboard-container h-full">
        <div className="dashboard-layout flex">
          <HrDashboard/>
          {/* <ScheduleSession/> */}
          {/* <PracticeTest/> */}
        </div>
      </section>
    </>
  );
}
