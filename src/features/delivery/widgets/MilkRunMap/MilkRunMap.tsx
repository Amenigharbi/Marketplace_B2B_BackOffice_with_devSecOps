import Map, {
  GeolocateControl,
  NavigationControl,
  FullscreenControl,
} from "react-map-gl";
import { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MarkerPopup from "../MarkerPopup";
import { useMilkRunMap } from "./useMilkRunMap";
import { IconMapPinFilled, IconMapPin } from "@tabler/icons-react";

const tunisLat = 36.70972;
const tunisLng = 10.174644;

const MilkRunMap = ({
  ordersMarkers,
  onDetailsClick,
  onOrderMarkerClick,
  selectedOrdersIds,
}: any) => {
  const { token, popupInfo, list, viewState, setPopupInfo, setViewState } =
    useMilkRunMap({
      ordersMarkers,
    });

  return (
    <Map
      {...viewState}
      mapboxAccessToken={token}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onMove={(event) => setViewState(event.viewState)}
    >
      <GeolocateControl />
      <FullscreenControl />
      <NavigationControl />

      <Marker key={"mghira_warehouse"} latitude={tunisLat} longitude={tunisLng}>
        <div key={"mghira_warehouse"}>
          <IconMapPinFilled size={38} className={`[&_path]:fill-black-800`} />
        </div>
      </Marker>
      {ordersMarkers?.length && (
        <div>
          {[...list].map((marker: any) => {
            if (!marker.latitude && !marker.longitude) {
              return null;
            }
            return (
              <Marker
                //@ts-ignore
                cursor={"pointer"}
                key={marker.orderId}
                latitude={marker.latitude}
                longitude={marker.longitude}
                onClick={(e: any) => {
                  e.originalEvent.stopPropagation();
                  onOrderMarkerClick && onOrderMarkerClick(marker.order_id);
                }}
              >
                <div
                  key={marker.order_id}
                  onMouseEnter={() => {
                    setPopupInfo(marker);
                  }}
                  onMouseLeave={() => {
                    setPopupInfo(null);
                  }}
                >
                  {selectedOrdersIds?.includes(marker.order_id) && (
                    <IconMapPinFilled
                      size={60}
                      className={`[&_path]:fill-green-800`}
                    />
                  )}
                  {!selectedOrdersIds?.includes(marker.order_id) && (
                    <IconMapPin
                      color={marker?.markerColor}
                      size={60}
                      className="[&_path]:green"
                    />
                  )}
                </div>
              </Marker>
            );
          })}

          {popupInfo && (
            <MarkerPopup
              onClose={() => {
                setPopupInfo(null);
              }}
              orderId={popupInfo?.order_id}
              customer={popupInfo?.name}
              latitude={popupInfo?.latitude}
              total={popupInfo?.order_amount}
              longitude={popupInfo?.longitude}
              deliverySlot={popupInfo?.delivery_slot}
              orderKamiounId={popupInfo?.kamioun_order_id}
              deliveryAgentName={popupInfo?.delivery_agent}
              onDetailsClick={() => onDetailsClick(popupInfo?.order_id)}
            />
          )}
        </div>
      )}
    </Map>
  );
};

export default MilkRunMap;

/*
   milkRunOrder={
    "created_at": "2024-07-15 14:18:49",
    "delivery_slot": "morning",
    "delivery_agent": "Vague 1",
    "creator": "Abir Hasni",
    "delivery_status": "",
    "delivery_agent_id": 6626,
    "creator_id": 6148,
    "order_id": 64347,
    "name": "Abir Hasni",
    "zone": "103, Av L'Environnement, Ezzahra 2034**",
    "signin_phone_number": "22191844",
    "status": "shipped",
    "state": "new",
    "longitude": 10.318403430283,
    "latitude": 36.735027123387,
    "order_amount": 337.57,
    "kamioun_order_id": "000053377"
}
  */
