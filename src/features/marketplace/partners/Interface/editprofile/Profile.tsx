import {
  IconCheck,
  IconCirclePlus,
  IconEdit,
  IconMail,
  IconMapPin,
  IconMessage,
  IconPhoneCall,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface ProfileProps {
  partnerData: any;
}

const Profile = ({ partnerData }: ProfileProps) => {
  // Format partner data for display
  const details = [
    {
      title: "Name",
      value: `${partnerData.firstName} ${partnerData.lastName}`,
    },
    {
      title: "Username",
      value: partnerData.username || "N/A",
    },
    {
      title: "Responsible Name",
      value: partnerData.responsibleName || "N/A",
    },
    {
      title: "Phone",
      value: partnerData.telephone || "N/A",
    },
    {
      title: "Email",
      value: partnerData.email || "N/A",
    },
    {
      title: "Position",
      value: partnerData.position || "N/A",
    },
    {
      title: "Coverage Area",
      value: partnerData.coverageArea || "N/A",
    },
    {
      title: "Minimum Amount",
      value: partnerData.minimumAmount?.toString() + " DT" || "N/A",
    },
    {
      title: "Address",
      value: partnerData.address || "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-4 xxxl:gap-6">
      <div className="col-span-12 lg:col-span-5 xl:col-span-4">
        <div className="box sticky top-0 p-2 sm:p-3">
          <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-primary/5 p-3 dark:bg-bg3 sm:p-5 xxxl:p-8">
            <div className="relative rounded-full bg-n0 p-3 dark:bg-bg4">
              <Image
                width={120}
                height={120}
                className="rounded-full"
                src={partnerData.logo || "/images/user-big-2.png"}
                alt="Partner Logo"
              />
              <div className="absolute bottom-10 right-2 rounded-full bg-primary p-1 text-n0">
                <IconCheck size={18} />
              </div>
            </div>
            <h4 className="h4 mb-3 mt-6 lg:mt-8">{`${partnerData.firstName} ${partnerData.lastName}`}</h4>
            <p className="mb-4 lg:mb-6">{partnerData.position || "Partner"}</p>

            {/* Contact info */}
            <div className="mt-7 flex flex-col gap-2 self-start md:gap-4 lg:mt-10">
              <div className="flex w-full items-center gap-1.5 md:gap-3">
                <div className="rounded-full text-primary">
                  <IconPhoneCall size={20} />
                </div>
                <span className="text-sm md:text-base">
                  {partnerData.telephone || "N/A"}
                </span>
              </div>
              <div className="flex w-full items-center gap-1.5 md:gap-3">
                <div className="rounded-full text-primary">
                  <IconMail size={20} />
                </div>
                <span className="text-sm md:text-base">
                  {partnerData.email || "N/A"}
                </span>
              </div>
              <div className="flex w-full items-center gap-1.5 md:gap-3">
                <div className="rounded-full text-primary">
                  <IconMapPin size={20} />
                </div>
                <span className="text-sm md:text-base">
                  {partnerData.address || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 lg:col-span-7 xl:col-span-8">
        <div className="box p-3">
          <div className="box bg-primary/5 dark:bg-bg3 xxxl:p-8">
            <p className="bb-dashed mb-6 pb-6 font-medium">Profile Info</p>

            {/* Personal Details */}
            <div className="box mb-4 border-none lg:mb-6 xxl:p-8">
              <div className="bb-dashed mb-4 flex items-center justify-between pb-4 md:mb-6 md:pb-6">
                <h5 className="h5">Partner Details</h5>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {details.map(({ title, value }) => (
                  <div
                    key={title}
                    className="col-span-3 sm:col-span-2 md:col-span-1"
                  >
                    <p className="mb-1 text-xs font-medium sm:text-sm">
                      {title}
                    </p>
                    <p className="text-base font-medium md:text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Information */}
            <div className="box border-none xxl:p-8">
              <div className="bb-dashed mb-4 flex items-center justify-between pb-4 md:mb-6 md:pb-6">
                <h5 className="h5">Business Information</h5>
              </div>
              <div className="grid grid-cols-12 gap-4 sm:gap-6">
                <div className="col-span-12 sm:col-span-4">
                  <p className="mb-1 text-xs font-medium sm:text-sm">
                    Coverage Area
                  </p>
                  <p className="text-base font-medium md:text-lg">
                    {partnerData.coverageArea || "N/A"}
                  </p>
                </div>
                <div className="col-span-12 sm:col-span-8">
                  <p className="mb-1 text-xs font-medium sm:text-sm">
                    Minimum Order Amount
                  </p>
                  <p className="text-base font-medium md:text-lg">
                    {partnerData.minimumAmount?.toString() + " DT" || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
