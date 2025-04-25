import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { Link } from 'react-router';
import NavItems from './NavItems';

const MobileSidebar = () => {
    let sidebar: SidebarComponent;

    const hideSidebar = () => {
        sidebar?.hide();
    };

    const toggleSidebar = () => {
        sidebar?.toggle();
    };

    return (
        <div className="mobile-sidebar wrapper">
            <header>
                <Link to="/" className="link-logo">
                    <img
                        src="/assets/icons/logo.svg"
                        alt="logo"
                        className="size-[30px]"
                    />
                    <h1>Trip Master</h1>
                </Link>
                <button onClick={toggleSidebar} type="button">
                    <img
                        src="/assets/icons/menu.svg"
                        alt="menu"
                        className="size-7"
                    />
                </button>
            </header>
            <SidebarComponent
                width={270}
                ref={(_sidebar: SidebarComponent) => {
                    sidebar = _sidebar;
                }}
                created={hideSidebar}
                closeOnDocumentClick={true}
                showBackdrop={true}
                type={'Over'}>
                <NavItems handleClick={hideSidebar} />
            </SidebarComponent>
        </div>
    );
};

export default MobileSidebar;
