import { Button } from "@nextui-org/react";
import Loading from "@/features/shared/elements/Loading";
import DeliverySlotSelector from "./DeliverySlotSelector";
import DeliveryAgentSelector from "@/features/shared/inputs/DeliveryAgentSelector/DeliveryAgentSelector";

const MilkRunToolbar = ({
  isLoading,
  isPending,
  onValidate,
  deliveryAgents,
  onMilkRunChange,
  onDeliveryAgentChange,
  deliverySlotSelectorRef,
  deliveryAgentSelectorRef,
}: any) => {
  return (
    <div className=" absolute bottom-2 left-1 z-10  flex     h-20  w-full  justify-between bg-n20 bg-n20  px-8 px-8">
      {!isLoading && (
        <div className="flex">
          <div className=" flex   flex-wrap items-center  justify-center">
            <p className=" mr-4 text-lg font-bold ">Agent :</p>
            <DeliveryAgentSelector
              direction="up"
              ref={deliveryAgentSelectorRef}
              deliveryAgents={deliveryAgents}
              onChange={onDeliveryAgentChange}
            />
          </div>
          <div className=" mx-4 flex flex-wrap items-center justify-center  ">
            <p className="mr-3 text-lg font-bold">Milk Run :</p>
            <DeliverySlotSelector
              onChange={onMilkRunChange}
              ref={deliverySlotSelectorRef}
            />
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center px-12">
          <Loading />
        </div>
      )}

      <div className="flex h-full items-center justify-center  ">
        {!isLoading && !isPending && (
          <Button className="mx-4" color="primary" onClick={onValidate}>
            Validate
          </Button>
        )}
      </div>
      {isPending && (
        <div className="flex items-center justify-center px-12">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default MilkRunToolbar;
