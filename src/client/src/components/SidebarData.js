import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

const signOut = () => {
  localStorage.removeItem('token');
};

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Courses",
    path: "/courses",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Enroll",
    path: "/enroll",
    icon: <FaIcons.FaUserPlus />,
    cName: "nav-text",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <IoIcons.IoMdSettings />,
    cName: "nav-text",
  },
  {
    title: "Sign Out",
    path: "/",
    icon: <FaIcons.FaSignOutAlt />,
    cName: "nav-text", 
    action: signOut,
  },
  
];