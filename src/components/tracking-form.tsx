"use client";
import { useState, useEffect, memo, useMemo } from "react";

import {
  arrayMove,
} from "@dnd-kit/sortable";
import debounce from "lodash.debounce";

// Types
import { TrackingField, TrackingResponse } from "@/types/tracking";

// Components
import { ResultSection } from "@components/results-section";
import CourierOptions from "@components/courier-options";

// Utils
import { FormRepeater } from "@/utils/formRepeater";

// Icons
import { CircleMinus } from "lucide-react";

// UI
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@components/ui/button"

// Aceternity
import { GlowingEffect } from "@/components/ui/glowing-effect";

// Motion
import * as motion from "motion/react-client"

type TrackingFieldProps = {
  field: TrackingField;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
};

const TrackingFieldInput = memo(({ field, index, onUpdate, onBlur, className, placeholder }: TrackingFieldProps) => {
  return (
    <Input
      id={`TrackingNumber-${index}`}
      type="text"
      value={field.tracking_number}
      onChange={(e) => onUpdate(index, e.target.value)}
      onBlur={onBlur}
      className={className}
      placeholder={placeholder}
    />
  );
});

TrackingFieldInput.displayName = "TrackingFieldInput";

export function TrackingForm() {
  const [balance, setBalance] = useState<number | null>(null);
  const [fields, setFields] = useState<TrackingField[]>([]);
  const maxFields = 6;
  const [trackingData, setTrackingData] = useState<TrackingResponse | null>(null);
  const [trackingFieldError, setTrackingFieldError] = useState<string[]>([""]);
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorData, setErrorData] = useState(null);
  const debouncedValidate = useMemo(
    () => debounce((field, index) => validateTracking(field, index), 300),
    []
  );

  const handleUpdate = (index: number, value: string) => {
    setFields((prev) => {
      const newFields = [...prev];
      newFields[index] = { ...newFields[index], tracking_number: value };
      debouncedValidate(newFields[index], index);
      return newFields;
    });
  };

  const handleRemove = (id: string) => {
    setFields((prev) => {
      if (prev.length === 1) return prev;
      const newFields = prev.filter((f) => f.id !== id);
      newFields.forEach((f, i) => validateTracking(f, i));
      setFormError("");
      return newFields;
    });
  }

  const validateTracking = (fields: TrackingField, index: number) => {
    let error = "";
    if (!fields.tracking_number?.trim()) {
      error = "Tracking number is required";
    } else if (fields.tracking_number.length < 5) {
      error = "Tracking number must be at least 5 characters";
    }
    setTrackingFieldError((prev) => {
      const newErrors = [...prev];
      newErrors[index] = error;
      return newErrors;
    });
    return !error;
  };

  const handleSearch = async () => {
    let isValid = true;
    fields.forEach((field, index) => {
      const result = validateTracking(field, index);
      if (!result) isValid = false;
    });
    if (!isValid) return;

    // reset
    setTrackingData(null);
    setErrorData(null);
    setFormError("");

    try {
      setLoading(true);
      const res = await fetch(`/api/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
      });

      if (!res.ok) {
        const errorMsg = await res.json();
        setErrorData(errorMsg.error);
        setLoading(false);
        return;
      }

      const newTracking = await res.json();
      setTrackingData(newTracking);
      setLoading(false);

      // Poll this tracking until data is populated
      const interval = setInterval(async () => {
        setLoading(true);
        const res = await fetch(`/api/get`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fields),
        });
        const updatedTracking = await res.json();

        if (updatedTracking?.trackinfo?.length > 0 || updatedTracking?.delivery_status !== "pending") {
          setTrackingData(updatedTracking);
          clearInterval(interval);
        }
        setLoading(false);
      }, 2000);

    } catch (err) {
      console.error("Error tracking the data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setFields([{ id: crypto.randomUUID(), tracking_number: "", courier_code: "auto" }]);

    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/tracking-credit");
        const data = await res.json();
        setBalance(data.balance);
      } catch (err) {
        console.error("Failed to fetch balance", err);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
      >
        <Card className="@container/card relative w-full sm:max-w-sm m-auto mb-3">
          <GlowingEffect
            blur={0}
            borderWidth={1}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <CardContent>
            <div className="mb-5 text-center">
              <h1 className="text-xl text-center font-semibold">Tracking Number</h1>
              <span className="text-xs opacity-50">Quota remaining: {balance ? balance : "Loading..."}</span>
            </div>
            <form>
              <FormRepeater
                items={fields}
                onAdd={() => {
                  if (fields.length === maxFields) {
                    setFormError(`Maximum of ${maxFields} fields allowed`);
                    return;
                  }
                  setFields((prev) => {
                    const newField = { id: crypto.randomUUID(), tracking_number: "", courier_code: "auto" };
                    const next = [...prev, newField];
                    return next;
                  });
                  setTrackingFieldError([...trackingFieldError, ""]);
                }}
                onRemove={() => {
                  setFormError("");
                }}
                onReorder={(oldIndex, newIndex) => {
                  setFields(arrayMove(fields, oldIndex, newIndex));
                  setTrackingFieldError(arrayMove(trackingFieldError, oldIndex, newIndex));
                }}
              >
                {(item, index) => (
                  <>
                    <div key={item.id} className="w-[calc(100%-15px-8px)] flex gap-2 my-2">
                      <CourierOptions
                        isDisabled={true}
                        value={fields[index].courier_code || "auto"}
                        onChange={(val) => {
                          const newFields = [...fields];
                          newFields[index] = {
                            ...newFields[index],
                            courier_code: val,
                          };
                          setFields(newFields);
                        }} />
                      <TrackingFieldInput
                        field={item}
                        index={index}
                        onUpdate={handleUpdate}
                        onBlur={() => validateTracking(fields[index], index)}
                        className={trackingFieldError[index] ? "border-red-600 focus-visible:border-red-600 focus-visible:ring-red-600/50" : ""}
                        placeholder="Enter tracking number"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemove(item.id)}
                        className="cursor-pointer transition duration-300 ease hover:dark:bg-red-700 active:dark:bg-red-900 hover:bg-red-500 active:bg-red-700"
                      >
                        <CircleMinus />
                      </Button>
                    </div>
                    {trackingFieldError[index] && <div className="ms-[10px] text-sm text-red-600">{trackingFieldError[index]}</div>}
                  </>
                )}
              </FormRepeater>
              <div className="mt-2 ms-[10px] text-sm text-red-600">{formError}</div>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button onClick={handleSearch} className="w-full cursor-pointer bg-black dark:bg-white/80 transition ease-in active:bg-black/50 active:dark:bg-white/60 hover:bg-black/75 hover:dark:bg-white">
              Track
            </Button>
          </CardFooter>
        </Card>

        {loading ? (
          <div className="flex gap-1 items-center justify-center pt-6 md:pt-10">
            <svg className="mr-1 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="animate-pulse">Loading...</span>
          </div>
        ) : (
          <div>
            <ResultSection
              trackingData={trackingData}
              errorData={errorData}
              setTrackingData={setTrackingData}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
}