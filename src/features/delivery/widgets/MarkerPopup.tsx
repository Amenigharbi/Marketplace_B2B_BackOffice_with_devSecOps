import { Popup } from "react-map-gl";
import { Button } from "@nextui-org/button";
import { IconSquareRoundedX } from "@tabler/icons-react";

const MarkerPopup = ({
  total,
  orderId,
  onClose,
  latitude,
  customer,
  longitude,
  deliverySlot,
  orderKamiounId,
  onDetailsClick,
  deliveryAgentName,
}: any) => {
  return (
    <Popup
      anchor="bottom"
      focusAfterOpen
      onClose={onClose}
      closeButton={false}
      style={{ width: "300px" }}
      latitude={Number(latitude)}
      longitude={Number(longitude)}
    >
      <div className="mb-4 flex w-full justify-between">
        <IconSquareRoundedX
          stroke={2}
          size={28}
          onClick={onClose}
          className="cursor-pointer"
        />
        <Button
          size="sm"
          className="font-bold"
          color="primary"
          onClick={onDetailsClick}
        >
          Details
        </Button>
      </div>
      <div className=" font-semibold text-black">
        Order Tech ID : <span className="font-bold text-n90">#{orderId}</span>
      </div>
      <div className=" font-semibold text-black">
        Order ID : <span className="font-bold text-n90">#{orderKamiounId}</span>
      </div>
      <div className=" font-semibold text-black">
        Customer : <span className="font-bold text-n90">{customer}</span>
      </div>
      <div className=" font-semibold text-black">
        Total :{" "}
        <span className="font-bold text-n90">{Number(total)?.toFixed(2)}</span>
      </div>
      <div className=" font-semibold text-black">
        Delivery Agent :{" "}
        <span className="font-bold text-n90">
          {deliveryAgentName || "*****"}
        </span>
      </div>
      <div className=" font-semibold text-black">
        Delivery Slot :{" "}
        <span className="font-bold text-n90">{deliverySlot || "*****"}</span>
      </div>
    </Popup>
  );
};

export default MarkerPopup;
