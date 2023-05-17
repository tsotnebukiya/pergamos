import { Sidebar } from "../Sidebar";
import Nav from "../navbar/Nav";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      void router.push("/auth");
    },
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") return null;
  return (
    <>
      <Sidebar />
      <div>
        <div className="lg:pl-72">
          <Nav user={data.user} />
          {children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
