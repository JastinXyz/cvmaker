import { Outlet } from "react-router";

export default function TemplateLayout() {
    return (
        <div className="max-w-[33rem]">
            <Outlet/>
        </div>
    )
}