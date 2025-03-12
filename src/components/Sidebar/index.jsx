import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
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
        link: "/UserPanel/Exposes",
        icon: "fas fa-paper-plane",
        name: "Exposes",
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
    {
        link: "/UserPanel/Exposes-External",
        icon: "fa-solid fa-question-circle",
        name: "Exposes External",
    },

];

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
];

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
];

const Sidebar = () => {
    const [iconSet, setIconSet] = useState(UserPanelItems);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes("ClientPanel")) {
            setIconSet(ClientPanelItems);
        } else if (location.pathname.includes("AgentPanel")) {
            setIconSet(AgentPanelItems);
        } else if (
            location.pathname.includes("users") ||
            location.pathname.includes("properties") ||
            location.pathname.includes("contact-us") ||
            location.pathname.includes("roles")
        ) {
            setIconSet([
                { link: "/users", icon: "fas fa-users", name: "Users" },
                { link: "/properties", icon: "fas fa-building", name: "Properties" },
                { link: "Exposes-External", icon: "fa-solid fa-question-circle", name: "External Exposed" },
                { link: "/roles", icon: "fas fa-user-shield", name: "Roles" },
                { link: "/contact-us", icon: "fas fa-envelope", name: "Contact Us" },
            ]);
        } else {
            setIconSet(UserPanelItems);
        }
    }, [location]);

    return (
        <div className="main-container">
            <Nav className="flex-column sidebar gap-3">
                {/* Logo */}
                <Nav.Item>
                    <img src={logo} alt="Logo" />
                </Nav.Item>

                {/* Dynamic navigation items with tooltips */}
                {iconSet.map((e, index) => (
                    <OverlayTrigger
                        key={index}
                        placement="right"
                        overlay={
                            <Tooltip id={`tooltip-${e.name}`} className="custom-tooltip">
                                {e.name}
                            </Tooltip>
                        }
                    >
                        <Nav.Item className="ms-2">
                            <Nav.Link as={Link} to={e.link}>
                                <i className={e.icon}></i>
                            </Nav.Link>
                        </Nav.Item>
                    </OverlayTrigger>

                ))}

                {/* Logout with tooltip */}
                <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip id="tooltip-logout" className="custom-tooltip">Log out</Tooltip>}
                >
                    <Nav.Item className="ms-2">
                        <Nav.Link
                            as={Link}
                            to="../signin"
                            className="border-top border-top-1 border-dark pt-4"
                        >
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </Nav.Link>
                    </Nav.Item>
                </OverlayTrigger>
            </Nav>
        </div>
    );
};

export default Sidebar;
