import React from "react";
import InputField from "app/(auth)/components/input-field";
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
      <InputField label="Street Address" name="street" value={address.street} onChange={handleChange} />
      <InputField label="City" name="city" value={address.city} onChange={handleChange} />
      <InputField label="State / Province" name="state" value={address.state} onChange={handleChange} />
      <InputField label="Postal Code" name="postalCode" value={address.postalCode} onChange={handleChange} />
      <InputField label="Country" name="country" value={address.country} onChange={handleChange} />
    </div>
  );
};

export default AddressInput;
