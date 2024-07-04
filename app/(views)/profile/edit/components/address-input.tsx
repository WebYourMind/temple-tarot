import React from "react";
import InputField from "app/(views)/(auth)/components/input-field";
import { Address } from "lib/types";
import CountryDropdown from "./countries";
import StateDropdown from "./states";

interface AddressInputProps {
  address: Address;
  setAddress: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setState: (v: string) => void;
  setCountry: (v: string) => void;
}

const AddressInput = ({ address, setAddress, setCountry, setState }: AddressInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e);
  };

  return (
    <div className="space-y-4">
      <CountryDropdown countryValue={address.country} setCountryValue={setCountry} />
      <StateDropdown countryValue={address.country} stateValue={address.state} setStateValue={setState} />
      <InputField
        label="Street Address"
        name="street"
        value={address.street}
        onChange={handleChange}
        placeholder="1600 Pennsylvania Ave NW"
      />
      <InputField label="City" name="city" value={address.city} onChange={handleChange} placeholder="Washington" />
      <InputField
        label="Postal Code"
        name="postalCode"
        value={address.postalCode}
        onChange={handleChange}
        placeholder="20500"
      />
    </div>
  );
};

export default AddressInput;
