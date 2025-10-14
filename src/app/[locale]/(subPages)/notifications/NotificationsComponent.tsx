import Box from "@/features/layout/Box/Box";
import NotificationComponent from "./NotificationComponent";
import { useGlobalStore } from "@/features/shared/stores/GlobalStore";

const Notifications = () => {
  const { notifications } = useGlobalStore();

  return (
    <Box title="Notifications">
      {notifications?.map((notification: any) => (
        <div className="cursor-pointer py-4" key={notification.id}>
          <NotificationComponent key={notification.id} data={notification} />
        </div>
      ))}
    </Box>
  );
};

export default Notifications;
