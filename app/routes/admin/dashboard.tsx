import { getAllUsers, getUser } from '@/appwrite/auth';
import {
    getTripsByTravelStyle,
    getUserAndTripStats,
    getUserGrowthPerDay,
} from '@/appwrite/dashboard';
import { getAllTrips } from '@/appwrite/trips';
import { Header, StatsCard, TripCard } from '@/components';
import { parseTripData } from '@/lib/utils';
import {
    Category,
    ChartComponent,
    ColumnSeries,
    DataLabel,
    Inject,
    SeriesCollectionDirective,
    SeriesDirective,
    SplineAreaSeries,
    Tooltip,
} from '@syncfusion/ej2-react-charts';
import type { Route } from './+types/dashboard';
import { userXAxis, useryAxis } from '@/constants';

export const clientLoader = async () => {
    const [
        user,
        dashboardStats,
        trips,
        userGrowth,
        tripsByTravelStyle,
        allUsers,
    ] = await Promise.all([
        getUser(),
        getUserAndTripStats(),
        getAllTrips(4, 0),
        getUserGrowthPerDay(),
        getTripsByTravelStyle(),
        getAllUsers(4, 0),
    ]);

    const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        imageUrls: imageUrls || [],
        ...parseTripData(tripDetail),
    }));

    const mappedUsers: Array<UsersItineraryCount> = allUsers.users.map(
        ({ imageUrl, name, itineraryCount }) => ({
            imageUrl,
            name,
            count: itineraryCount,
        }),
    );

    return {
        user,
        dashboardStats,
        allTrips,
        userGrowth,
        tripsByTravelStyle,
        allUsers: mappedUsers,
    };
};

const Dashboard = ({
    loaderData: {
        user,
        dashboardStats: {
            totalTrips,
            tripsCreated,
            totalUsers,
            userRole,
            usersJoined,
        },
        allTrips,
        allUsers,
        tripsByTravelStyle,
        userGrowth,
    },
}: Route.ComponentProps) => {
    return (
        <main className="dashboard wrapper">
            <Header
                title={`Welcome ${user?.name ?? 'Guest'}`}
                description="Track activity, trends and popular destinations in real time"
            />
            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle="Total Users"
                        total={totalUsers}
                        currentMonthCount={usersJoined.currentMonth}
                        lastMonthCount={usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Total Trips"
                        total={totalTrips}
                        currentMonthCount={tripsCreated.currentMonth}
                        lastMonthCount={tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Active Users"
                        total={userRole.total}
                        currentMonthCount={userRole.currentMonth}
                        lastMonthCount={userRole.lastMonth}
                    />
                </div>
            </section>
            <section className="container">
                <h1 className="text-xl font-semibold text-dark-100">
                    Created Trips
                </h1>
                <div className="trip-grid">
                    {allTrips.map(
                        ({
                            id,
                            name,
                            imageUrls,
                            itinerary,
                            interests,
                            travelStyle,
                            estimatedPrice,
                        }) => (
                            <TripCard
                                key={id}
                                id={id.toString()}
                                name={name}
                                imageUrl={imageUrls[0]}
                                location={itinerary?.[0]?.location ?? ''}
                                tags={[interests, travelStyle]}
                                price={estimatedPrice}
                            />
                        ),
                    )}
                </div>
            </section>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <ChartComponent
                    id="chart-1"
                    primaryXAxis={userXAxis}
                    primaryYAxis={useryAxis}
                    title="User Growth"
                    tooltip={{ enable: true }}>
                    <Inject
                        services={[
                            ColumnSeries,
                            SplineAreaSeries,
                            Category,
                            DataLabel,
                            Tooltip,
                        ]}
                    />
                    <SeriesCollectionDirective>
                        <SeriesDirective
                            dataSource={userGrowth}
                            xName="day"
                            yName="count"
                            type="Column"
                            name="Column"
                            columnWidth={0.3}
                            cornerRadius={{ topLeft: 10, topRight: 10 }}
                        />
                    </SeriesCollectionDirective>
                </ChartComponent>
            </section>
        </main>
    );
};

export default Dashboard;
