import { Outlet } from "react-router-dom";
import MainNavigation from "../Components/MainNavigation";

function RootLayout() {
  return (
    <>
      <MainNavigation />
      <hr />
      <Outlet />
    </>
  );
}

export default RootLayout;
