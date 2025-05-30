import Sidebar from "@/components/sidebar";
import { JSX } from "react";

interface PropsInterface {
    children: React.ReactNode;
}

const Layout = (props: PropsInterface): JSX.Element => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-24 p-4">
                {props.children}
            </main>
        </div>
    );
};

export default Layout;
