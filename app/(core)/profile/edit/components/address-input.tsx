import React from "react";
import InputField from "app/(core)/(auth)/components/input-field";
import { Address } from "lib/types";

interface AddressInputProps {
  address: Address;
  setAddress: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AddressInput = ({ address, setAddress }: AddressInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e);
  };

  return (
    <div className="space-y-4">
      <InputField
        label="Street Address"
        name="street"
        value={address.street}
        onChange={handleChange}
        placeholder="1600 Pennsylvania Ave NW"
      />
      <InputField label="City" name="city" value={address.city} onChange={handleChange} placeholder="Washington" />
      <InputField
        label="State / Province"
        name="state"
        value={address.state}
        onChange={handleChange}
        placeholder="DC"
      />
      <InputField
        label="Postal Code"
        name="postalCode"
        value={address.postalCode}
        onChange={handleChange}
        placeholder="20500"
      />
      <InputField
        label="Country"
        name="country"
        value={address.country}
        onChange={handleChange}
        placeholder="United States"
      />
    </div>
  );
};

export default AddressInput;
