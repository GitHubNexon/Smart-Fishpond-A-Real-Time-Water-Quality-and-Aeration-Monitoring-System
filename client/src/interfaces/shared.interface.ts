export interface FormModalProps {
  open: boolean;
  close: () => void;
  onSuccess?: () => void;
  initialData?: any;
  mode?: "add" | "edit";
}