"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "components/ui/button";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

import { cn, lowerCase, sentenceCase } from "lib/utils";
import states from "./data/states.json";

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: string;
  longitude: string;
}

const StateDropdown = ({ countryValue, stateValue, setStateValue }) => {
  const [openStateDropdown, setOpenStateDropdown] = useState(false);

  const SD = states as StateProps[];
  const S = SD.filter((state) => state.country_name === sentenceCase(countryValue));

  return (
    <Popover open={openStateDropdown} onOpenChange={() => setOpenStateDropdown(!openStateDropdown)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openStateDropdown}
          className="w-full justify-between"
          disabled={!countryValue || S.length === 0}
        >
          {stateValue ? (
            <div className="flex items-end gap-2">
              <span>{S.find((state) => state.name === stateValue)?.name}</span>
            </div>
          ) : (
            <span>Select State...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-md border border-input p-0">
        <Command>
          <CommandInput placeholder="Search state..." />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px] w-full">
              <CommandList>
                {S.map((state) => (
                  <CommandItem
                    key={state.id}
                    value={state.name}
                    onSelect={(currentValue) => {
                      setStateValue(currentValue);
                      setOpenStateDropdown(false);
                    }}
                    className="flex cursor-pointer items-center justify-between text-xs hover:bg-accent"
                  >
                    <div className="flex items-end gap-2">
                      <span className="">{state.name}</span>
                    </div>
                    <Check
                      className={cn("mr-2 h-4 w-4", stateValue === lowerCase(state.name) ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandList>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StateDropdown;
