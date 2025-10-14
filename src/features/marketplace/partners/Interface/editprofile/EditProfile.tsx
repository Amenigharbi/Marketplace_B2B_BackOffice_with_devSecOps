"use client";
import {
  IconCircleKey,
  IconNotes,
  IconSettings,
  IconUser,
  IconUserCircle,
} from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import { Transition } from "react-transition-group";

import ChangePassword from "./ChangePassword";
import MyAccount from "./MyAccount";
import PersonalDetails from "./PersonalDetails";
import Profile from "./Profile";
import Settings from "./Settings";
import { toast } from "react-hot-toast";
import { useAuth } from "@/features/shared/hooks/useAuth";
import axios from "axios";

const duration = 500;

const defaultStyle: React.CSSProperties = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
};
interface TransitionStyles {
  entering: React.CSSProperties;
  entered: React.CSSProperties;
  exiting: React.CSSProperties;
  exited: React.CSSProperties;
}
const transitionStyles: TransitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState(1);
  const nodeRef = useRef(null);
  const [partnerData, setPartnerData] = useState<any>(null);
  const [partnerSettings, setPartnerSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);

        // Fetch partner data
        const partnerResponse = await axios.get(
          `/api/marketplace/partners/${user.id}`,
        );
        if (partnerResponse.data && partnerResponse.data.partner) {
          setPartnerData(partnerResponse.data.partner);

          // After getting partner data, fetch settings
          try {
            const settingsResponse = await axios.get(
              `/api/marketplace/settings/getAll`,
            );
            if (settingsResponse.data && settingsResponse.data.settings) {
              // Find settings for this partner
              const partnerSettings = settingsResponse.data.settings.find(
                (setting: any) => setting.partnerId === user.id,
              );
              setPartnerSettings(partnerSettings || null);
            }
          } catch (settingsError) {
            console.error("Error fetching settings:", settingsError);
          }
        }
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Failed to load partner profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [user?.id]);

  const handleUpdatePartner = async (updatedData: any) => {
    if (!partnerData?.id) return;

    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await axios.patch(
        `/api/marketplace/partners/${partnerData.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data && response.data.partner) {
        setPartnerData(response.data.partner);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error("Error updating partner:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleUpdateSettings = async (updatedSettings: any) => {
    try {
      if (partnerSettings) {
        // Update existing settings
        const response = await axios.patch(
          `/api/marketplace/settings/${partnerSettings.id}`,
          {
            ...updatedSettings,
            partnerId: partnerData.id,
          },
        );

        if (response.data && response.data.settings) {
          // Get current schedule IDs from the database
          const currentScheduleIds = partnerSettings.schedules.map(
            (s: any) => s.id,
          );

          // Get schedule IDs from the updated settings
          const updatedScheduleIds = updatedSettings.schedules
            .filter((s: any) => s.id)
            .map((s: any) => s.id);

          // Find schedules that were deleted (in current but not in updated)
          const deletedScheduleIds = currentScheduleIds.filter(
            (id: string) => !updatedScheduleIds.includes(id),
          );

          // 1. Delete removed schedules
          for (const scheduleId of deletedScheduleIds) {
            await axios.delete(
              `/api/marketplace/settings_schedule/${scheduleId}`,
            );
          }

          // 2. Update existing schedules
          const existingSchedules = updatedSettings.schedules.filter(
            (s: any) => s.id,
          );
          for (const schedule of existingSchedules) {
            await axios.patch(
              `/api/marketplace/settings_schedule/${schedule.id}`,
              {
                day: schedule.day,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                settingId: partnerSettings.id,
              },
            );
          }

          // 3. Create new schedules
          const newSchedules = updatedSettings.schedules.filter(
            (s: any) => !s.id,
          );
          for (const schedule of newSchedules) {
            await axios.post("/api/marketplace/settings_schedule/create", {
              day: schedule.day,
              startTime: schedule.startTime,
              endTime: schedule.endTime,
              settingId: partnerSettings.id,
            });
          }

          // 4. Fetch updated settings with all schedules
          const refreshedSettingsResponse = await axios.get(
            `/api/marketplace/settings/${partnerSettings.id}`,
          );
          if (
            refreshedSettingsResponse.data &&
            refreshedSettingsResponse.data.settings
          ) {
            setPartnerSettings(refreshedSettingsResponse.data.settings);
          }

          toast.success("Settings updated successfully");
        }
      } else {
        // Create new settings
        console.log("Creating new settings:", updatedSettings);
        const response = await axios.post(`/api/marketplace/settings/create`, {
          deliveryType: updatedSettings.deliveryType,
          deliveryTypeAmount: updatedSettings.deliveryTypeAmount,
          freeDeliveryAmount: updatedSettings.freeDeliveryAmount,
          loyaltyPointsAmount: updatedSettings.loyaltyPointsAmount,
          loyaltyPointsUnique: updatedSettings.loyaltyPointsUnique,
          partnerId: partnerData.id,
        });

        if (response.data && response.data.settings) {
          const settingId = response.data.settings.id;
          console.log("New settings created with ID:", settingId);

          // Create schedules
          const schedulePromises = updatedSettings.schedules.map(
            (schedule: any) =>
              axios.post("/api/marketplace/settings_schedule/create", {
                day: schedule.day,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                settingId: settingId,
              }),
          );

          await Promise.all(schedulePromises);

          // Fetch the complete settings with schedules
          const refreshedSettingsResponse = await axios.get(
            `/api/marketplace/settings/${settingId}`,
          );
          if (
            refreshedSettingsResponse.data &&
            refreshedSettingsResponse.data.settings
          ) {
            setPartnerSettings(refreshedSettingsResponse.data.settings);
          }

          toast.success("Settings created successfully");
        }
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">Loading...</div>
    );
  }

  if (!partnerData) {
    return (
      <div className="flex h-full items-center justify-center">
        Partner profile not found
      </div>
    );
  }

  const tabData = [
    {
      id: 1,
      name: "Profile",
      icon: <IconUser />,
      content: <Profile partnerData={partnerData} />,
    },
    {
      id: 2,
      name: "Personal Details",
      icon: <IconNotes />,
      content: (
        <PersonalDetails
          partnerData={partnerData}
          onUpdate={handleUpdatePartner}
        />
      ),
    },
    {
      id: 3,
      name: "My Account",
      icon: <IconUserCircle />,
      content: (
        <MyAccount partnerData={partnerData} onUpdate={handleUpdatePartner} />
      ),
    },
    {
      id: 4,
      name: "Change Password",
      icon: <IconCircleKey />,
      content: <ChangePassword partnerId={partnerData.id} />,
    },
    {
      id: 5,
      name: "Settings",
      icon: <IconSettings />,
      content: (
        <Settings
          settings={partnerSettings}
          partnerId={partnerData.id}
          onUpdate={handleUpdateSettings}
        />
      ),
    },
  ];

  return (
    <div>
      <div className="box mb-4 flex flex-wrap gap-3 md:gap-4 xxxl:mb-6 xxxl:gap-6">
        {tabData.map(({ id, name, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 rounded-2xl px-4 py-2 font-medium md:py-3 lg:px-6 ${
              activeTab == id
                ? "bg-primary text-n0"
                : "bg-primary/5 text-n700 dark:bg-bg3 dark:text-n0"
            }`}
          >
            <span className={`${id == activeTab ? "text-n0" : "text-primary"}`}>
              {icon}
            </span>
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div>
        {tabData.map(({ id, content }) => (
          <Transition
            nodeRef={nodeRef}
            in={activeTab == id}
            timeout={duration}
            key={id}
          >
            {(state) => (
              <div
                ref={nodeRef}
                style={{
                  ...defaultStyle,
                  ...transitionStyles[state as keyof TransitionStyles],
                }}
              >
                {activeTab == id && content}
              </div>
            )}
          </Transition>
        ))}
      </div>
    </div>
  );
};

export default EditProfile;
