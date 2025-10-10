import UserDashboard from './UserDashborad';

export default function UserDashboardMain() {
    return (
        <>
            <section className="dashboard-container h-full">
                <div className="dashboard-layout flex">
                    <UserDashboard />
                </div>
            </section>
        </>
    );
}
