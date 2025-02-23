import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav } from "react-bootstrap";
import logo from "../../assests/img/logo-removebg-preview.png";
import "./sidebar.css";

const UserPanelItems = [
    {
        link: "/UserPanel/Home",
        icon: "fas fa-house",
        name: "Home",
    },
    {
        link: "/UserPanel",
        icon: "fas fa-search",
        name: "Search",
    },
    {
        link: "/UserPanel",
        icon: "fas fa-clipboard",
        name: "Details",
    },
    {
        link: "/UserPanel/Alert",
        icon: "fas fa-bell",
        name: "Alert",
    },
    {
        link: "/UserPanel/FavouritePage",
        icon: "fas fa-heart",
        name: "Favourite",
    },
    {
        link: "/UserPanel/Profile",
        icon: "fa-solid fa-user",
        name: "Profile",
    },
]

const AgentPanelItems = [
    {
        link: "/AgentPanel",
        icon: "fas fa-search",
        name: "Search",
    },
    {
        link: "/AgentPanel/Exposes",
        icon: "fas fa-paper-plane",
        name: "Exposes",
    },
    {
        link: "/AgentPanel/History",
        icon: "fas fa-history",
        name: "History",
    },
    {
        link: "/AgentPanel/Transactions",
        icon: "fas fa-user-shield",
        name: "Handle",
    },
    {
        link: "/AgentPanel/Auth",
        icon: "fas fa-key",
        name: "Auth",
    },
    {
        link: "/AgentPanel/AllUser",
        icon: "fas fa-user",
        name: "All Users",
    }
]

const ClientPanelItems = [
    {
        link: "/ClientPanel/Transactions",
        icon: "fa-solid fa-cart-shopping",
        name: "Transactions",
    },
    {
        link: "/ClientPanel",
        icon: "fas fa-search",
        name: "Search",
    },
    {
        link: "/ClientPanel/Exposes",
        icon: "fa-solid fa-share-from-square",
        name: "Exposes",
    },
    {
        link: "/ClientPanel/Auth",
        icon: "fa-solid fa-info",
        name: "Info",
    }
]

const Sidebar = () => {
    const [iconSet, setIconSet] = useState(UserPanelItems)
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('ClientPanel')) {
            console.log('You are at Client Panel')
            setIconSet(ClientPanelItems)
        } else if (location.pathname.includes('AgentPanel')) {
            console.log('You are at Agent Panel')
            setIconSet(AgentPanelItems)
        } else {
            console.log('You are at User Panel')
            setIconSet(UserPanelItems)
        }
    }, [location])


    return (
        <div className="main-container">
            <Nav className="flex-column  sidebar gap-3">
                {/* Logo */}
                <Nav.Item>
                    <img src={logo} alt="" />
                </Nav.Item>

                {/* Change Item based on path */}
                {
                    iconSet.map(e =>
                        <Nav.Item className="ms-2">
                            <Nav.Link as={Link} to={e.link} title={e.name}>
                                <i className={e.icon}></i>
                                <span>{e.name}</span>
                            </Nav.Link>
                        </Nav.Item>
                    )
                }

                {/* Logout */}
                <Nav.Item className="ms-2">
                    <Nav.Link
                        as={Link}
                        to="../signin"
                        className="border-top border-top-1 border-dark pt-4"
                        title="Log out"
                    >
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <span>Log out</span>
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div >
    );
};

export default Sidebar;
