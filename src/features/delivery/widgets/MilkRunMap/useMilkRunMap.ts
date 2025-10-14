import { useEffect, useState } from "react";
import { predefinedColors } from "./predefinedColors";

const tunisLat = 36.70972;
const tunisLng = 10.174644;
const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export const useMilkRunMap = ({ ordersMarkers }: any) => {
  const [popupInfo, setPopupInfo] = useState<any>(null);
  const [list, setList] = useState<any[]>([]);
  const [viewState, setViewState] = useState({
    zoom: 10,
    latitude: tunisLat,
    longitude: tunisLng,
  });

  useEffect(() => {
    setPopupInfo(null);
  }, [list]);

  useEffect(() => {
    const agentColors = {};
    let colorIndex = 0;
    const newList: any[] = [];

    // Iterate through the orders and assign colors from the predefined list
    ordersMarkers?.forEach((order: any) => {
      const agentId = order.delivery_agent_id;
      //@ts-ignore
      if (!agentColors[agentId]) {
        //@ts-ignore
        agentColors[agentId] =
          predefinedColors[colorIndex % predefinedColors.length];
        colorIndex++;
      }
      //@ts-ignore
      order.markerColor = agentColors[agentId];
      newList.push(order);
    });

    setList(newList);
  }, [ordersMarkers]);

  return { token, popupInfo, list, viewState, setPopupInfo, setViewState };
};
