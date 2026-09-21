import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Outlet />
    </div>
  );
};
