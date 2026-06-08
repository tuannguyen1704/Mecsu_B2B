import { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowRight } from 'lucide-react';

const PULSE_STYLE = `
@keyframes pulseRing {
  0%   { transform: translate(-50%,-50%) scale(0.6); opacity: 0.9; }
  80%  { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
  100% { transform: translate(-50%,-50%) scale(1.4); opacity: 0; }
}
`;

interface Props {
  shippingAddress: string;
  shippingLat?: number;
  shippingLng?: number;
  orderStatus?: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled';
  standalone?: boolean;
}

const MECSU_COORDS_LNG_LAT: [number, number] = [106.6160, 10.7629];
const FALLBACK_COORDS_LNG_LAT: [number, number] = [106.6956, 10.7861];

type LatLng = [number, number]; // [lat, lng] for Leaflet

const STATUS_TEXT: Record<string, string> = {
  pending: 'Chờ xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao hàng',
  completed: 'Đã giao hàng',
  cancelled: 'Đã hủy',
};

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createCustomIcon = (type: 'warehouse' | 'customer') => {
  const isWarehouse = type === 'warehouse';
  const size = isWarehouse ? 60 : 64;

  // Pulse ring HTML — only for customer marker
  const pulseRing = isWarehouse
    ? ''
    : `<div style="
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        width:${size + 24}px;
        height:${size + 24}px;
        border-radius:50%;
        background:rgba(242,201,76,0.25);
        animation:pulseRing 1.8s ease-out infinite;
        pointer-events:none;
      "></div>`;

  const bg = isWarehouse ? '#173E75' : '#F2C94C';
  const textColor = isWarehouse ? '#fff' : '#173E75';
  const emoji = isWarehouse ? '🏭' : '📦';
  const label = isWarehouse ? 'Kho MECSU' : 'Giao hàng';

  return L.divIcon({
    html: `<div style="
      position:relative;
      display:flex;
      align-items:center;
      gap:6px;
      background:${bg};
      color:${textColor};
      padding:8px 16px;
      border-radius:8px;
      font-size:14px;
      font-weight:600;
      white-space:nowrap;
      box-shadow:0 10px 25px rgba(15,23,42,.18);
      border:2px solid #fff;
    ">${emoji} ${label}</div>${pulseRing}`,
    className: '',
    iconAnchor: isWarehouse ? [30, 30] : [(size + 24) / 2, (size + 24) / 2],
    iconSize: [size, size],
  });
};

// Fits map bounds to route when it loads, or to markers as fallback
const BoundsFitter: React.FC<{
  routeCoords: LatLng[];
  mecsPos: LatLng;
  customerPos: LatLng;
}> = ({ routeCoords, mecsPos, customerPos }) => {
  const map = useMap();

  useEffect(() => {
    if (routeCoords.length > 0) {
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { paddingBottomRight: [250, 150] });
    } else {
      const bounds = L.latLngBounds([mecsPos, customerPos]);
      map.fitBounds(bounds, { paddingBottomRight: [250, 150] });
    }
  }, [routeCoords, mecsPos, customerPos, map]);

  return null;
};

const OrderTrackingMap: React.FC<Props> = ({
  shippingAddress,
  shippingLat,
  shippingLng,
  orderStatus = 'shipping',
  standalone = false,
}) => {
  // OSRM uses [lng, lat], Leaflet uses [lat, lng]
  const customerLngLat: [number, number] =
    shippingLat && shippingLng ? [shippingLng, shippingLat] : FALLBACK_COORDS_LNG_LAT;

  const mecsLatLng: LatLng = [10.7629, 106.6160];
  const customerLatLng: LatLng = [customerLngLat[1], customerLngLat[0]];

  const straightLineCoords: LatLng[] = [mecsLatLng, customerLatLng];

  const distance = haversineDistance(
    mecsLatLng[0],
    mecsLatLng[1],
    customerLatLng[0],
    customerLatLng[1]
  );
  const timeMinutes = Math.round(distance * 2.5);
  const statusLabel = STATUS_TEXT[orderStatus] || 'Đang giao hàng';

  const [routeCoords, setRouteCoords] = useState<LatLng[]>([]);

  // Fetch real driving route from OSRM
  useEffect(() => {
    const url = `https://router.project-osrm.org/route/v1/driving/${MECSU_COORDS_LNG_LAT[0]},${MECSU_COORDS_LNG_LAT[1]};${customerLngLat[0]},${customerLngLat[1]}?overview=full&geometries=geojson`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          // OSRM returns [lng, lat] — convert to Leaflet [lat, lng]
          const coords = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] as LatLng
          );
          setRouteCoords(coords);
        }
      })
      .catch(() => {
        // Fallback: straight line stays in state as empty
      });
  }, []);

  const mapContainer = (
    <div
      style={{
        position: 'relative',
        height: '320px',
        borderRadius: '18px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(16,24,40,0.08)',
        overflow: 'hidden',
      }}
      className="md:!h-[400px]!"
    >
      <style dangerouslySetInnerHTML={{ __html: PULSE_STYLE }} />
      <MapContainer
        center={mecsLatLng}
        zoom={13}
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="brightness-[0.97] contrast-[1.02]"
        />

        <ZoomControl position="bottomright" />

        {routeCoords.length > 0 ? (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#173E75',
              weight: 6,
              opacity: 0.9,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        ) : (
          <Polyline
            positions={straightLineCoords}
            pathOptions={{
              color: '#173E75',
              weight: 4,
              opacity: 0.5,
              dashArray: '10, 10',
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        )}

        <Marker position={mecsLatLng} icon={createCustomIcon('warehouse')}>
          <Popup>
            <strong>Kho MECSU Bình Tân</strong>
          </Popup>
        </Marker>

        <Marker position={customerLatLng} icon={createCustomIcon('customer')}>
          <Popup>
            <strong>Địa chỉ giao hàng</strong>
            <br />
            {shippingAddress || 'Chưa có địa chỉ'}
          </Popup>
        </Marker>

        <BoundsFitter
          routeCoords={routeCoords}
          mecsPos={mecsLatLng}
          customerPos={customerLatLng}
        />
      </MapContainer>

      {/* Floating ETA card — top right, over the map */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 1000,
          background: '#fff',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '12px 16px',
          boxShadow: '0 8px 24px rgba(16,24,40,0.12)',
          minWidth: '140px',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500', marginBottom: '6px' }}>
          {statusLabel}
        </div>
        <div style={{ fontSize: '22px', fontWeight: '700', color: '#173E75', lineHeight: '1' }}>
          {distance.toFixed(1)} km
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
          ETA: ~{timeMinutes} phút
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return (
      <div>
        <div className="px-6">{mapContainer}</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#173E75',
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#173E75' }}>
              Kho MECSU Bình Tân
            </span>
          </div>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(to right, #173E75, #F2C94C)',
              borderRadius: '2px',
            }}
          />
          <ArrowRight size={16} style={{ color: '#94A3B8' }} />
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(to right, #F2C94C, #94A3B8)',
              borderRadius: '2px',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#F2C94C',
              }}
            />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#64748B' }}>
              Địa chỉ giao hàng
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full">{mapContainer}</div>;
};

export default OrderTrackingMap;
