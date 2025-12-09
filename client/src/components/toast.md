``` tsx
how to use

import { toast } from "@/components/Toaster"
import { Button } from "@/components/ui/button"

toast.success({
  title: "Success",
  description: "You logged in successfully!",
  position: "bottom-left", // optional, default top-right
  customButton: <Button onClick={() => console.log("Continue clicked!")}>Continue</Button>,
})

```