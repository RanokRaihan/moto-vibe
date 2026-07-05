import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import MainNav from "./MainNav";

import { useLogoutMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [logoutApi, { isLoading }] = useLogoutMutation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      const res = await logoutApi(undefined).unwrap();
      if (res.success) {
        dispatch(logout());
        toast.success("Logout success!");
      }
    } catch (error) {
      console.log({ error });
      toast.error("Logout failed!");
    }
  };
  return (
    <header className="nav-height py-0 px-2 flex flex-col items-center justify-center border-b border-[#e5e5e5]">
      <div className="container mx-auto">
        <nav className="flex justify-between items-center">
          {isMobile && <MobileNav />}
          <Link to="/">
            <img src={logo} alt="MotoVibe logo" className="h-12" />
          </Link>
          {!isMobile && <MainNav />}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full size-12 text-3xl"
                >
                  <User />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {user?.role === "admin" && (
                  <DropdownMenuItem>
                    <Link to="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                {user?.role === "customer" && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/change-password">Change Password</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Orders</Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-left">
                  <button
                    className="w-full text-left"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    Logout
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
