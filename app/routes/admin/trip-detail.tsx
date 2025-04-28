import { getAllTrips, getTripById } from '@/appwrite/trips';
import { Header, InfoPill, TripCard } from '@/components';
import { cn, getFirstWord, parseTripData } from '@/lib/utils';
import {
    ChipDirective,
    ChipListComponent,
    ChipsDirective,
} from '@syncfusion/ej2-react-buttons';
import type { LoaderFunctionArgs } from 'react-router';
import type { Route } from './+types/trip-detail';

export const loader = async ({ params: { tripId } }: LoaderFunctionArgs) => {
    if (!tripId) {
        throw new Error('Trip ID is required');
    }

    const result = await Promise.all([getTripById(tripId), getAllTrips(4, 0)]);

    return {
        trip: result[0],
        trips: result[1].allTrips.map(({ $id, tripDetail, imageUrls }) => ({
            id: $id,
            imageUrls: imageUrls || [],
            ...parseTripData(tripDetail),
        })),
    };
};

const TripDetail = ({ loaderData }: Route.ComponentProps) => {
    const {
        name,
        duration,
        itinerary,
        travelStyle,
        groupType,
        budget,
        interests,
        estimatedPrice,
        description,
        bestTimeToVisit,
        weatherInfo,
        country,
    } = parseTripData(loaderData?.trip?.tripDetail as string) || {};

    const pillItems = [
        {
            text: travelStyle,
            bg: '!bg-pink-50 !text-pink-500',
        },
        {
            text: groupType,
            bg: '!bg-primary-50 !text-primary-500',
        },
        {
            text: budget,
            bg: '!bg-success-50 !text-success-700',
        },
        {
            text: interests,
            bg: '!bg-navy-50 !text-navy-500',
        },
    ];

    const visitTimeAndWeatherInfo = [
        {
            title: 'Best Time to Visit: ',
            items: bestTimeToVisit,
        },
        {
            title: 'Weather',
            items: weatherInfo,
        },
    ];

    return (
        <main className="travel-detail wrapper">
            <Header
                title="Trip Details"
                description="View and edit AI-generated travel plans"
            />
            <section className="container wrapper-md">
                <header>
                    <h1 className="p-40-semibold">{name}</h1>
                    <div className="items-center flex gap-5">
                        <InfoPill
                            text={`${duration} day plan`}
                            image="/assets/icons/calendar.svg"
                        />
                        <InfoPill
                            text={
                                itinerary
                                    ?.slice(0, 4)
                                    .map(item => item.location)
                                    .join(', ') || ''
                            }
                            image="/assets/icons/calendar.svg"
                        />
                    </div>
                </header>
                <section className="gallery">
                    {(loaderData?.trip?.imageUrls || []).map(
                        (url: string, index: number) => (
                            <img
                                key={url}
                                src={url}
                                alt="url"
                                className={cn(
                                    'w-full rounded-xl object-cover',
                                    index === 0
                                        ? 'md:col-span-2 md:row-span-2 h-[330px]'
                                        : 'md:row-span-1 h-[150px]',
                                )}
                            />
                        ),
                    )}
                </section>
                <section className="flex gap-3 md:gap-5 items-center flex-wrap">
                    <ChipListComponent id="travel-chip">
                        <ChipsDirective>
                            {pillItems.map((item, index) =>
                                item.text ? (
                                    <ChipDirective
                                        key={index}
                                        text={getFirstWord(item.text)}
                                        cssClass={`${item.bg} !text-base !font-medium !px-4`}
                                    />
                                ) : null,
                            )}
                        </ChipsDirective>
                    </ChipListComponent>
                    <ul className="flex gap-1 items-center">
                        {Array(5)
                            .fill(null)
                            .map((_, index) => (
                                <li key={index}>
                                    <img
                                        src="/assets/icons/star.svg"
                                        alt="star"
                                        className="size-[18px]"
                                    />
                                </li>
                            ))}
                        <li className="ml-1">
                            <ChipListComponent>
                                <ChipsDirective>
                                    <ChipDirective
                                        text={'4.9/5'}
                                        cssClass="!bg-yellow-50 !text-yellow-700"
                                    />
                                </ChipsDirective>
                            </ChipListComponent>
                        </li>
                    </ul>
                </section>
                <section className="title">
                    <article>
                        <h3>
                            {duration}-Day {country} {travelStyle}
                        </h3>
                        <p>
                            {budget}, {groupType} and {interests}
                        </p>
                    </article>
                    <h2>{estimatedPrice}</h2>
                </section>
                <p className="text-sm md:text-lg font-normal text-dark-400">
                    {description}
                </p>
                <ul className="itinerary">
                    {itinerary?.map((dayPlan: DayPlan, index) => (
                        <li key={index}>
                            <h3>
                                Day {dayPlan.day}: {dayPlan.location}
                            </h3>
                            <ul>
                                {dayPlan.activities.map((activity, index) => (
                                    <li key={index}>
                                        <span className="flex-shrink-0 p-18-semibold">
                                            {activity.time}
                                        </span>
                                        <p className="flex-grow">
                                            {activity.description}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
                {visitTimeAndWeatherInfo.map(section => (
                    <section key={section.title} className="visit">
                        <div className="">
                            <h3>{section.title}</h3>
                            <ul>
                                {section.items?.map(item => (
                                    <li key={item}>
                                        <p className="flex-grow">{item}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                ))}
            </section>
            <section className="flex flex-col gap-6">
                <h2 className="p-24-semibold">Popular Trips</h2>
                <div className="trip-grid">
                    {(loaderData?.trips as Array<Trip> | []).map(
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
                                id={id}
                                key={id}
                                name={name}
                                location={itinerary?.[0].location ?? ''}
                                imageUrl={imageUrls[0]}
                                tags={[interests, travelStyle]}
                                price={estimatedPrice}
                            />
                        ),
                    )}
                </div>
            </section>
        </main>
    );
};

export default TripDetail;
