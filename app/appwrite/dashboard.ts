import { parseTripData } from '@/lib/utils';
import { appwriteConfig, database } from './client';

type Document = {
    [key: string]: unknown;
};

type FilterByDate = (
    items: Array<Document>,
    key: string,
    start: string,
    end?: string,
) => number;

export const getUserAndTripStats = async (): Promise<DashboardStats> => {
    const d = new Date();
    const startCurrent = new Date(
        d.getFullYear(),
        d.getMonth(),
        1,
    ).toISOString();
    const startPrev = new Date(
        d.getFullYear(),
        d.getMonth() - 1,
        1,
    ).toISOString();
    const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();

    const [trips, users] = await Promise.all([
        database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.tripCollectionId,
        ),
        database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
        ),
    ]);

    const filterByDate: FilterByDate = (items, key, start, end) =>
        items.filter(item => item[key] >= start && (!end || item[key] <= end))
            .length;

    const filterUsersByRole = (role: string) =>
        users.documents.filter((u: Document) => u.status === role);

    return {
        totalUsers: users.total,
        usersJoined: {
            currentMonth: filterByDate(
                users.documents,
                'joinedAt',
                startCurrent,
                undefined,
            ),
            lastMonth: filterByDate(
                users.documents,
                'joinedAt',
                startPrev,
                endPrev,
            ),
        },
        userRole: {
            total: filterUsersByRole('user').length,
            currentMonth: filterByDate(
                filterUsersByRole('user'),
                'joinedAt',
                startCurrent,
                undefined,
            ),
            lastMonth: filterByDate(
                filterUsersByRole('user'),
                'joinedAt',
                startPrev,
                endPrev,
            ),
        },
        totalTrips: trips.total,
        tripsCreated: {
            currentMonth: filterByDate(
                trips.documents,
                'createdAt',
                startCurrent,
                undefined,
            ),
            lastMonth: filterByDate(
                trips.documents,
                'createdAt',
                startPrev,
                endPrev,
            ),
        },
    };
};

export const getUserGrowthPerDay = async () => {
    const users = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
    );

    const userGrowth = users.documents.reduce(
        (acc: { [key: string]: number }, user: Document) => {
            const date = new Date(user.joinedAt);
            const day = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        },
        {},
    );

    return Object.entries(userGrowth).map(([day, count]) => ({
        count: Number(count),
        day,
    }));
};

export const getTripsCreatedPerDay = async () => {
    const trips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
    );

    const tripsGrowth = trips.documents.reduce(
        (acc: { [key: string]: number }, trip: Document) => {
            const date = new Date(trip.createdAt);
            const day = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
            acc[day] = (acc[day] || 0) + 1;
            return acc;
        },
        {},
    );

    return Object.entries(tripsGrowth).map(([day, count]) => ({
        count: Number(count),
        day,
    }));
};

export const getTripsByTravelStyle = async () => {
    const trips = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.tripCollectionId,
    );

    const travelStyleCounts = trips.documents.reduce(
        (acc: { [key: string]: number }, trip: Document) => {
            const tripDetail = parseTripData(trip.tripDetails);

            if (tripDetail?.travelStyle) {
                const travelStyle = tripDetail.travelStyle;
                acc[travelStyle] = (acc[travelStyle] || 0) + 1;
            }
            return acc;
        },
        {},
    );

    return Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
        count: Number(count),
        travelStyle,
    }));
};
