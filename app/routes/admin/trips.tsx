import { Header } from '@/components';

const Trips = () => {
    return (
        <main className="all-users wrapper">
            <Header
                ctaText="Create a trip"
                ctaUrl="/trips/create"
                description="View and edit AI-generated travel plans"
                title="Trips"
            />
        </main>
    );
};

export default Trips;
