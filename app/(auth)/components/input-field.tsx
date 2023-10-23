import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

interface InputFieldProps {
  id: string;
  placeholder: string;
  type: string;
  disabled: boolean;
  label: string;
}

export default function InputField({ id, placeholder, type, disabled, label }: InputFieldProps) {
  return (
    <div className="grid gap-1">
      <Label className="sr-only" htmlFor={id}>
        {label}
      </Label>
      <Input id={id} placeholder={placeholder} type={type} disabled={disabled} />
    </div>
  );
}
