import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("pages/layout.tsx", [
        index("routes/home.tsx"),
        route("app", "routes/app.tsx"),
    ]),

    route("/template/berkeley", "pages/template/berkeley.tsx"),
    route("/template/otago", "pages/template/otago.tsx"),
] satisfies RouteConfig;
