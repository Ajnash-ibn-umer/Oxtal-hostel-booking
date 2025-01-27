"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormMessage } from "@/components/ui/form";
import MultiSelect from "@/components/MultiSelect/multi-selector";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "./page";
import MultiFileUploader from "@/components/MultiFileUploader/file-uploader";
export type Bed = {
  availabilityStatus: number;
  bedPosition: number;
  floor: string;
  name: string;
  paymentBase: number;
  roomTypeId: string;
};

type Room = {
  aminityIds: string[];
  beds: Bed[];
  floor: number;
  name: string;
  roomTypeId: string;
  totalBeds: number;
  galleryIds: string[];
};

type Hostel = {
  rooms: Room[];
};
interface RoomCreationProps {
  amenityData: any;
  roomTypeData: any;
  form: UseFormReturn;
  hostel: Hostel;
  setHostel: React.Dispatch<React.SetStateAction<Hostel>>;
}

export default function RoomCreationForm({
  amenityData,
  roomTypeData,
  form,
  hostel,
  setHostel,
}: RoomCreationProps) {
  //   const [hostel, setHostel] = useState<Hostel>({
  //     rooms: [],
  //   });

  const addRoom = () => {
    setHostel((prev: { rooms: any }) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          name: "",
          aminityIds: [],
          beds: [],
          floor: 0,
          roomTypeId: "",
          totalBeds: 0,
          galleryIds: [],
        },
      ],
    }));
  };

  const addBed = (roomIndex: number) => {
    setHostel((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room, idx) =>
        idx === roomIndex
          ? {
              ...room,
              beds: [
                ...room.beds,
                {
                  name: "",
                  code: "",
                  availabilityStatus: 0,
                  bedPosition: 0,
                  floor: "",
                  paymentBase: 0,
                  roomTypeId: "",
                },
              ],
            }
          : room,
      ),
    }));
  };

  const updateRoom = (index: number, field: keyof Room, value: string) => {
    setHostel((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room, idx) =>
        idx === index ? { ...room, [field]: value } : room,
      ),
    }));
  };

  const updateBed = (
    roomIndex: number,
    bedIndex: number,
    field: keyof Bed,
    value: string,
  ) => {
    setHostel((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room, rIdx) =>
        rIdx === roomIndex
          ? {
              ...room,
              beds: room.beds.map((bed, bIdx) =>
                bIdx === bedIndex ? { ...bed, [field]: value } : bed,
              ),
            }
          : room,
      ),
    }));
  };

  const removeRoom = (index: number) => {
    setHostel((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, idx) => idx !== index),
    }));
  };

  const removeBed = (roomIndex: number, bedIndex: number) => {
    setHostel((prev) => ({
      ...prev,
      rooms: prev.rooms.map((room, rIdx) =>
        rIdx === roomIndex
          ? { ...room, beds: room.beds.filter((_, bIdx) => bIdx !== bedIndex) }
          : room,
      ),
    }));
  };

  return (
    <>
      <Card className="w-full ">
        <CardHeader>
          <CardTitle>Create New Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-4">
              {hostel &&
                hostel.rooms &&
                hostel.rooms.length > 0 &&
                hostel.rooms.map((room, roomIndex) => (
                  <Card key={roomIndex}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-lg">
                        Room {roomIndex + 1}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRoom(roomIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`roomName-${roomIndex}`}>
                            Room Name
                          </Label>
                          <Input
                            id={`roomName-${roomIndex}`}
                            value={room.name}
                            onChange={(e) =>
                              updateRoom(roomIndex, "name", e.target.value)
                            }
                            placeholder="Enter room name"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`roomFloor-${roomIndex}`}>
                            Floor
                          </Label>
                          <Input
                            id={`roomFloor-${roomIndex}`}
                            value={room.floor}
                            onChange={(e) =>
                              updateRoom(roomIndex, "floor", e.target.value)
                            }
                            placeholder="Enter room floor"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`roomTotalBeds-${roomIndex}`}>
                            Total Beds
                          </Label>
                          <Input
                            id={`roomTotalBeds-${roomIndex}`}
                            value={room.totalBeds}
                            onChange={(e) =>
                              updateRoom(roomIndex, "totalBeds", e.target.value)
                            }
                            placeholder="Enter total beds"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`aminityIds-${roomIndex}`}>
                            Amenities
                          </Label>
                          <MultiSelect
                            selectedValues={hostel.rooms[roomIndex].aminityIds}
                            onChange={(val: string[]) => {
                              setHostel((prev) => ({
                                ...prev,
                                rooms: prev.rooms.map((room, rIdx) =>
                                  rIdx === roomIndex
                                    ? { ...room, aminityIds: val }
                                    : room,
                                ),
                              }));
                            }}
                            values={
                              amenityData &&
                              amenityData.Amenity_List?.list.map(
                                (amenity: any) => ({
                                  value: amenity._id,
                                  label: amenity.name,
                                }),
                              )
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`roomRoomTypeId-${roomIndex}`}>
                            Room Type
                          </Label>

                          <Select
                            value={room.roomTypeId}
                            defaultValue={"Upper"}
                            onValueChange={(e) => {
                              console.log({ e });
                              return updateRoom(roomIndex, "roomTypeId", e);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue
                                defaultValue={room.roomTypeId}
                                id={`roomRoomTypeId-${roomIndex}`}
                                placeholder="Select a Room Type"
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {roomTypeData &&
                                roomTypeData.RoomType_List?.list &&
                                roomTypeData.RoomType_List?.list.length > 0 &&
                                roomTypeData.RoomType_List?.list.map(
                                  (loc: any) => {
                                    return (
                                      <SelectItem value={loc._id}>
                                        {loc.name}
                                      </SelectItem>
                                    );
                                  },
                                )}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Card className="mb-10 flex w-full flex-col p-5">
                        <MultiFileUploader
                          onChange={(files: File[]) => {
                            console.log({ files });
                            setInterval(() => {
                              console.log({ files });
                            }, 1000);
                          }}
                        ></MultiFileUploader>
                      </Card>
                      {/* <div className="space-y-2">
                        <Label className="font-bold:300">Beds</Label> <br />
                        {room.beds.map((bed, bedIndex) => (
                          <div
                            key={bedIndex}
                            className="flex items-center space-x-2 gap-2 justify-between align-baseline"
                          >
                            <div className="item-between flex flex-col gap-1">
                              <Label htmlFor={`roomRoomTypeId-${roomIndex}`}>
                                Room Type
                              </Label>
                              <Input
                                value={bed.roomTypeId}
                                onChange={(e) =>
                                  updateBed(
                                    roomIndex,
                                    bedIndex,
                                    "roomTypeId",
                                    e.target.value,
                                  )
                                }
                                placeholder="Room Type"
                              />
                            </div>
                            <div className="item-between flex flex-col gap-1">
                              <Label htmlFor={`bedPosition-${roomIndex}`}>
                                BedPosition
                              </Label>
                              <Select
                                value={bed.bedPosition.toString()}
                                defaultValue={"Upper"}
                                onValueChange={(e) => {
                                  console.log({ e });
                                  return updateBed(
                                    roomIndex,
                                    bedIndex,
                                    "bedPosition",
                                    e,
                                  );
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a bedPosition" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem  defaultChecked value="1">Upper</SelectItem>
                                  <SelectItem value="2">Lower</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBed(roomIndex, bedIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => addBed(roomIndex)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Bed
                        </Button>
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
            </div>

            <Button type="button" variant="outline" onClick={addRoom}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* <Button type="submit" className="w-full">
        Create Hostel
      </Button> */}
    </>
  );
}
