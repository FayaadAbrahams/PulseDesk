import {Links, Meta, Outlet, Scripts, ScrollRestoration} from "react-router";
import "./index.css";
import "./styles/styles.css";
import type {ReactNode} from "react";
import {Toaster} from "./components/ui/sonner";

export function Layout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="icon" type="image/svg+xml" href="/note-icon.svg"/>
            <title>PulseDesk</title>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Toaster/>
        {children}
        <ScrollRestoration/>
        <Scripts/>
        </body>
        </html>
    )
}

export default function Root() {
    return (
        <Outlet/>
    );
}