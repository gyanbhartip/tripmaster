import { Header } from '@/components';
import { TESTUSER } from '@/constants';

const Dashboard = () => {
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${TESTUSER?.name ?? 'Guest'}`}
                description="Track activity, trends and popular destinations in real time"
            />
            dashboard page content
        </main>
    );
};

export default Dashboard;
