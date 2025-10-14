import { Toaster } from "react-hot-toast";
import AuthWrapper from "@/libs/next-auth/authWrapper";
import TanstackQueryProvider from "@/libs/tanstackQuery/TanstackQueryProvider";
import { useEffect } from "react";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";
import { io } from "socket.io-client";

//@ts-ignore
const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const { setNotifications } = useGlobalStore();
  useEffect(() => {
    socket.on("connect", () => {
      console.info("connected to socket");
    });
    socket.on("notification", (data: Notification) => {
      setNotifications(data);
    });
  }, [setNotifications]);
  return (
    <AuthWrapper>
      <TanstackQueryProvider>
        <Toaster />
        {children}
      </TanstackQueryProvider>
    </AuthWrapper>
  );
};

export default RootLayout;
