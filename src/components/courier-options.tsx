"use client";
import { FC } from "react";

import Image from "next/image";

import { carrierIcons } from "@utils/carrierIcons";

// UI
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  isDisabled?: boolean;
  value: string;
  onChange: (val: string) => void;
}

const CourierOptions: FC<Props> = ({ isDisabled, value, onChange }) => {
  const courier = Object.values(carrierIcons).find((c) => c.value === value);

  return (
    <Select disabled={!isDisabled} value={value} onValueChange={onChange}>
      <SelectTrigger className="disabled:opacity-100 min-w-[55px] @[320px]:min-w-[65px] max-w-[65px] justify-center gap-[1px] @[320px]:gap-[5px] @[425px]:gap-[8px]">
        {courier ? (
          <Image src={courier.img} alt={courier.label} width={20} height={20} style={{width: "auto", height: "auto"}} />
        ) : (
          "Auto"
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">
          <div className="flex items-center gap-2">
            <span>Auto</span>
          </div>
        </SelectItem>
        {Object.values(carrierIcons).map((courier) => (
          <SelectItem key={courier.value} value={courier.value}>
            <div className="flex items-center gap-2">
              <Image src={courier.img} alt={courier.label} width={20} height={20} style={{width: "auto", height: "auto"}} />
              <span>{courier.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CourierOptions;