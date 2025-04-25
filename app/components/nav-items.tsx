import { TESTUSER, sidebarItems } from '@/constants';
import { cn } from '@/lib/utils';
import { Link, NavLink } from 'react-router';

type Props = {
    handleClick: () => void;
};

const NavItems = ({ handleClick }: Props) => {
    return (
        <section className="nav-items">
            <Link to="/" className="link-logo">
                <img
                    src="/assets/icons/logo.svg"
                    alt="logo"
                    className="size-[30px]"
                />
                <h1>Trip Master</h1>
            </Link>
            <div className="container">
                <nav>
                    {sidebarItems.map(({ href, icon, id, label }) => (
                        <NavLink to={href} key={id}>
                            {({ isActive }: { isActive: boolean }) => (
                                <div
                                    className={cn('group nav-item', {
                                        'bg-primary-100 !text-white': isActive,
                                    })}
                                    onClick={handleClick}>
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={`group-hover:brightness-0 size-0 group-hover:invert ${
                                            isActive
                                                ? 'brightness-0 invert'
                                                : 'text-dark-200'
                                        }`}
                                    />
                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>
                <footer className="nav-footer">
                    <img
                        src={TESTUSER?.imageUrl || '/assets/images/david.webp'}
                        alt={TESTUSER?.name || 'User Photo'}
                    />
                    <article>
                        <h2>{TESTUSER?.name}</h2>
                        <p>{TESTUSER?.email}</p>
                    </article>
                    <button
                        onClick={() => {
                            console.log('logout');
                        }}
                        className="cursor-pointer"
                        type="button">
                        <img
                            src="/assets/icons/logout.svg"
                            alt="logout"
                            className="size-6"
                        />
                    </button>
                </footer>
            </div>
        </section>
    );
};

export default NavItems;
