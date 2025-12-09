# Modal Component Usage Guide

This document explains how to use the `Modal` component in your project.

---

## 1. Import the Component

```tsx
import Modal from "@/components/customs/modal/Modal";
```

---

## 2. Basic Usage

```tsx
import React, { useState } from "react";
import Modal from "@/components/customs/modal/Modal";

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Open Modal
      </button>

      <Modal open={isOpen} close={() => setIsOpen(false)} title="My Modal">
        <p>This is the body content of the modal.</p>
      </Modal>
    </div>
  );
};

export default Example;
```

---

## 3. With Header and Footer Content

```tsx
<Modal
  open={isOpen}
  close={() => setIsOpen(false)}
  title="Custom Modal"
  headerChildren={<span className="text-sm text-gray-400">Extra header</span>}
  footerChildren={
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => setIsOpen(false)}
        className="px-3 py-1 bg-gray-300 rounded-md"
      >
        Cancel
      </button>
      <button
        onClick={() => alert("Confirmed!")}
        className="px-3 py-1 bg-blue-500 text-white rounded-md"
      >
        Confirm
      </button>
    </div>
  }
>
  <p>You can add any JSX content inside the modal body.</p>
</Modal>
```

---

## 4. Custom Width

You can override the modal width with the `width` prop.

```tsx
<Modal
  open={isOpen}
  close={() => setIsOpen(false)}
  title="Large Modal"
  width="w-11/12 max-w-5xl"
>
  <p>This modal has a custom width.</p>
</Modal>
```

---

## 5. Props Reference

| Prop             | Type         | Default               | Description                             |
| ---------------- | ------------ | --------------------- | --------------------------------------- |
| `open`           | `boolean`    | `false`               | Controls whether the modal is visible.  |
| `close`          | `() => void` | —                     | Function to close the modal.            |
| `title`          | `string`     | `""`                  | Title displayed in the header.          |
| `children`       | `ReactNode`  | —                     | Modal body content.                     |
| `headerChildren` | `ReactNode`  | —                     | Extra content to show in the header.    |
| `footerChildren` | `ReactNode`  | —                     | Content for the footer (e.g., buttons). |
| `width`          | `string`     | `"w-11/12 max-w-3xl"` | Tailwind classes for modal width.       |

---

✅ Now you can use the `Modal` component flexibly with headers, footers, and custom widths.
