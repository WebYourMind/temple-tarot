"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "components/ui/button";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";

import { cn, lowerCase } from "lib/utils";
import countries from "./data/countries.json";

interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

interface CountryProps {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  timezones: Timezone[];
  translations: Record<string, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

interface CountryDropdownProps {
  disabled?: boolean;
  countryValue: string;
  setCountryValue: (country: string) => void;
}

const CountryDropdown = ({ disabled, countryValue = "", setCountryValue }: CountryDropdownProps) => {
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [countryList, setCountryList] = useState<CountryProps[]>([]);

  useEffect(() => {
    if (Array.isArray(countries)) {
      setCountryList(countries);
    } else {
      console.error("Countries data is not an array", countries);
    }
  }, []);

  return (
    <Popover open={openCountryDropdown} onOpenChange={() => setOpenCountryDropdown(!openCountryDropdown)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={openCountryDropdown}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span>
            {countryValue ? (
              <div className="flex items-end gap-2">
                <span>{countryList.find((country) => country.name === countryValue)?.emoji}</span>
                <span>{countryList.find((country) => country.name === countryValue)?.name}</span>
              </div>
            ) : (
              <span>Select Country...</span>
            )}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full rounded-md border border-input p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px] w-full">
              <CommandList>
                {countryList?.length > 0 ? (
                  countryList.map((country) => (
                    <CommandItem
                      key={country.id}
                      value={country.name}
                      onSelect={(currentValue) => {
                        console.log(currentValue);
                        setCountryValue(currentValue);
                        setOpenCountryDropdown(false);
                      }}
                      className="flex cursor-pointer items-center justify-between text-xs hover:bg-accent"
                    >
                      <div className="flex items-end gap-2">
                        <span>{country.emoji}</span>
                        <span className="">{country.name}</span>
                      </div>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          countryValue === lowerCase(country.name) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))
                ) : (
                  <div className="p-4">No countries available.</div>
                )}
              </CommandList>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountryDropdown;
