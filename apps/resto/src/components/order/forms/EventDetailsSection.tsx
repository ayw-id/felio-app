import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventType } from "@/hooks/useEvent";
import { Switch } from "@/components/ui/Switch";
import { Plus } from "lucide-react";

interface EventDetailsSectionProps {
  order: CustomerOrder;
  update: (params: UpdateParams) => void;
  eventTypes: EventType[];
  eventLocations: EventType[];
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  order,
  update,
  eventTypes,
  eventLocations,
}) => {
  return (
    <section className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="eventDate">Tanggal Event (Opsional)</Label>
        <Input
          type="date"
          id="eventDate"
          value={order.eventDate}
          onChange={(e) => update({ eventDate: e.target.value })}
        />
      </div>

      <div>
        <Label htmlFor="eventType">Tipe Event (Opsional)</Label>
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id="paymentEnabled"
            disabled={!eventTypes.length}
            checked={order.eventType?.id === "-1" || !eventTypes.length}
            onCheckedChange={(checked) => {
              update({
                ...order,
                eventType: {
                  id: checked ? "-1" : "",
                  name: "",
                },
              });
            }}
          />
          <Label htmlFor="paymentEnabled">
            {order.eventType?.id === "-1" || !eventTypes.length
              ? "Tipe event baru"
              : "Tipe event"}
          </Label>
        </div>
        {order.eventType?.id !== "-1" && eventTypes.length ? (
          <select
            id="eventType"
            className="w-full p-2 border rounded-md mt-4"
            value={order.eventType?.id}
            onChange={(e) => {
              const selectedEventType = eventTypes.find(
                (event) => event.id === e.target.value
              );
              update({
                eventType: {
                  id: e.target.value,
                  name: selectedEventType?.name,
                },
              });
            }}
          >
            <option value="">Pilih tipe event</option>
            {eventTypes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        ) : (
          <Input
            className="w-full p-2 border rounded-md mt-4"
            id="newEventType"
            value={order.eventType?.name}
            placeholder="Tipe event baru"
            onChange={(e) =>
              update({
                eventType: { ...order.eventType, name: e.target.value },
              })
            }
            required
          />
        )}
      </div>

      <div>
        <Label htmlFor="eventType">Lokasi Event (Opsional)</Label>
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id="paymentEnabled"
            disabled={!eventLocations.length}
            checked={order.eventLocation?.id === "-1" || !eventLocations.length}
            onCheckedChange={(checked) => {
              update({
                ...order,
                eventLocation: {
                  id: checked ? "-1" : "",
                  name: "",
                },
              });
            }}
          />
          <Label htmlFor="paymentEnabled">
            {order.eventLocation?.id === "-1" || !eventLocations.length
              ? "Lokasi event baru"
              : "Lokasi event"}
          </Label>
        </div>
        {order.eventLocation?.id !== "-1" && eventLocations.length ? (
          <select
            id="eventLocation"
            className="w-full p-2 border rounded-md mt-4"
            value={order.eventLocation?.id}
            onChange={(e) => {
              const selectedEventLocation = eventLocations.find(
                (event) => event.id === e.target.value
              );
              update({
                eventLocation: {
                  id: e.target.value,
                  name: selectedEventLocation?.name,
                },
              });
            }}
          >
            <option value="">Pilih lokasi event</option>
            {eventLocations.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        ) : (
          <Input
            id="newEventLocation"
            className="w-full p-2 border rounded-md mt-4"
            value={order.eventLocation?.name}
            placeholder="cth: hotel, pantai, dll"
            onChange={(e) =>
              update({
                eventLocation: { ...order.eventLocation, name: e.target.value },
              })
            }
            required
          />
        )}
      </div>
    </section>
  );
};

export default EventDetailsSection;
