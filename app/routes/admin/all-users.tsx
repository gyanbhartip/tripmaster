import { getAllUsers } from '@/appwrite/auth';
import { Header } from '@/components';
import { cn, formatDate } from '@/lib/utils';
import {
    ColumnDirective,
    ColumnsDirective,
    GridComponent,
} from '@syncfusion/ej2-react-grids';
import type { Route } from './+types/all-users';

export const loader = async () => await getAllUsers(10, 0);

const AllUsers = ({ loaderData: { total, users } }: Route.ComponentProps) => {
    return (
        <main className="all-users wrapper">
            <Header
                title="Manage Users"
                description="Filter, sort and access detailed user profiles"
            />
            <GridComponent dataSource={users} gridLines="None">
                <ColumnsDirective>
                    <ColumnDirective
                        field="name"
                        headerText="Name"
                        width={'200'}
                        textAlign="Left"
                        template={({ imageUrl, name }: UserData) => (
                            <div className="flex items-center gap-1.5 px-4">
                                <img
                                    src={imageUrl}
                                    alt="user"
                                    className="rounded-full size-8 aspect-square"
                                    referrerPolicy="no-referrer"
                                />
                                <span>{name}</span>
                            </div>
                        )}
                    />
                    <ColumnDirective
                        field="email"
                        headerText="Email Address"
                        width={'200'}
                        textAlign="Left"
                    />
                    <ColumnDirective
                        field="joinedAt"
                        headerText="Date Joined"
                        width={'120'}
                        textAlign="Left"
                        template={({ joinedAt }: { joinedAt: string }) =>
                            formatDate(joinedAt)
                        }
                    />
                    {/* <ColumnDirective
                        field="itineraryCreated"
                        headerText="Trip Created"
                        width={'130'}
                        textAlign="Left"
                    /> */}
                    <ColumnDirective
                        field="status"
                        headerText="Type"
                        width={'100'}
                        textAlign="Left"
                        template={({ status }: UserData) => (
                            <article
                                className={cn(
                                    'status-column',
                                    status === 'user'
                                        ? 'bg-success-50'
                                        : 'bg-light-300',
                                )}>
                                <div
                                    className={cn(
                                        'size-1.5 rounded-full',
                                        status === 'user'
                                            ? 'bg-success-500'
                                            : 'bg-gray-500',
                                    )}
                                />
                                <h3
                                    className={cn(
                                        'font-inter test-xs font-medium',
                                        status === 'user'
                                            ? 'text-success-700'
                                            : 'text-gray-500',
                                    )}>
                                    {status}
                                </h3>
                            </article>
                        )}
                    />
                </ColumnsDirective>
            </GridComponent>
        </main>
    );
};

export default AllUsers;
