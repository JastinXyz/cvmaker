import { Outlet } from "react-router";
import Background from "~/components/background";

export default function Layout() {
    return (
        <>
            <Background />
            <div className="flex justify-center h-screen">
                <div className="m-auto z-50 py-8">
                    <Outlet />
                </div>
            </div>
        </>
    )
}