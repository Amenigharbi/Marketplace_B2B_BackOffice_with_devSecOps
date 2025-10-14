import React from "react";
import { useRouter } from "@/libs/next-intl/i18nNavigation";

type CardProps = {
  data: any;
  index: number;
};

const Card = ({ data, index }: CardProps) => {
  const router = useRouter();

  const getStatusColor = (status: any) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-yellow-500";
      case "Draft":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleEdit = () => {
    router.push(`/screen/${data._id}`);
  };

  return (
    <div key={data.id} className="rounded-lg border p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{data.title}</h2>
          <p className="text-sm text-gray-500">{data.timestamp}</p>
          <p className="mt-2 text-sm text-gray-500">{data.description}</p>
        </div>
        {data.status && (
          <span
            className={`${getStatusColor(
              data.status,
            )} rounded-full px-2 py-1 text-xs font-medium text-white`}
          >
            {data.status}
          </span>
        )}
      </div>
      <button
        onClick={handleEdit}
        className="mt-4 w-full rounded-lg bg-gray-100 py-2 text-black hover:bg-gray-200"
      >
        Edit screen
      </button>
    </div>
  );
};

export default Card;
