import { NavItems } from '@/components';
import MobileSidebar from '@/components/mobile-sidebar';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { Outlet } from 'react-router';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <MobileSidebar />
            <aside className="w-full max-w-[270px] hidden lg:block">
                <SidebarComponent width={270} enableGestures={false}>
                    <NavItems handleClick={() => {}} />
                </SidebarComponent>
            </aside>
            <aside className="children">
                <Outlet />
            </aside>
        </div>
    );
};
export default AdminLayout;
