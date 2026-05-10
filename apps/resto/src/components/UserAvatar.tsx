import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, LogOut, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  storageNames,
  dStoreStorageNames,
  builderStorageNames,
  restoStorageNames,
} from "/src/utils/constants";

const settingRoutes = ["brand", "branch"];

const UserAvatar = () => {
  const location = useLocation();
  const isSettingPage = settingRoutes.some((route) =>
    location.pathname.startsWith(import.meta.env.BASE_URL + route)
  );

  const handleLogout = () => {
    Object.values(storageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(dStoreStorageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(builderStorageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    Object.values(restoStorageNames).forEach((key) => {
      localStorage.removeItem(key);
    });

    window.location.href = `${import.meta.env.BASE_URL}login/`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
          <AvatarImage src="" alt="User Avatar" />
          <AvatarFallback className="bg-blue-500 text-white">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isSettingPage && (
          <DropdownMenuItem asChild>
            <Link
              to={import.meta.env.BASE_URL + "brand"}
              className="flex items-center cursor-pointer"
            >
              <Building className="mr-2 h-4 w-4" />
              <span>Pengaturan Brand</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/*<DropdownMenuItem className="flex items-center cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Pengaturan</span>
        </DropdownMenuItem>*/}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Keluar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
