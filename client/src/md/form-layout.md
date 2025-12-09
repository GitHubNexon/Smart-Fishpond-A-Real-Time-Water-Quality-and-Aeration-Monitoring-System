# Form Layout System - Installation Guide

## 📦 Prerequisites

Make sure you have a Next.js project with **Shadcn UI** already configured.

## 🚀 Installation Steps

### 1. Install Required Dependencies

```bash
# Install Shadcn UI components (if not already installed)
npx shadcn-ui@latest init

# Install required Shadcn components
npx shadcn-ui@latest add label
npx shadcn-ui@latest add input
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add button

# Install Lucide React for icons
npm install lucide-react
```

### 2. Create the Form Layout Component

Create a new file at `src/components/customs/form-layout.tsx` and paste the form layout code provided.

### 3. Ensure Your `cn` Utility Exists

The form layout uses the `cn` utility from Shadcn. It should already exist at `src/lib/utils.ts`:

```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If it doesn't exist, install the dependencies:

```bash
npm install clsx tailwind-merge
```

## 📁 File Structure

```
src/
├── components/
│   ├── customs/
│   │   ├── form-layout.tsx          ← New reusable form components
│   │   ├── modal/
│   │   ├── alert-dialog.tsx
│   │   ├── date-picker.tsx
│   │   └── form-previewer.tsx
│   └── ui/
│       ├── label.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── button.tsx
└── lib/
    └── utils.ts
```

## 🎨 Usage Examples

### Basic Usage

```tsx
import {
  FormContainer,
  FormSection,
  FormGrid,
  FormField,
} from '@/components/customs/form-layout';
import { Package, DollarSign, Hash } from 'lucide-react';
import { Input } from '@/components/ui/input';

function MyForm() {
  return (
    <FormContainer>
      <FormSection
        title="Basic Information"
        description="Enter core details"
        icon={<Package className="w-4 h-4" />}
      >
        <FormGrid columns={2}>
          <FormField
            label="Product Name"
            icon={<Hash className="w-4 h-4" />}
            required
            helper="Unique product identifier"
          >
            <Input placeholder="Enter name" />
          </FormField>

          <FormField
            label="Price"
            icon={<DollarSign className="w-4 h-4" />}
            required
          >
            <Input type="number" placeholder="0.00" />
          </FormField>
        </FormGrid>
      </FormSection>
    </FormContainer>
  );
}
```

### Full-Width Fields

```tsx
<FormField
  label="Description"
  fullWidth  // Spans across columns
  required
>
  <Textarea placeholder="Enter description" />
</FormField>
```

### With Error Handling

```tsx
<FormField
  label="Email"
  required
  error={errors.email}  // Shows error message
  helper={!errors.email && "We'll never share your email"}
>
  <Input type="email" />
</FormField>
```

### Different Grid Layouts

```tsx
{/* Single column */}
<FormGrid columns={1}>
  {/* fields */}
</FormGrid>

{/* Two columns (default) */}
<FormGrid columns={2}>
  {/* fields */}
</FormGrid>

{/* Three columns */}
<FormGrid columns={3}>
  {/* fields */}
</FormGrid>
```

## 🎯 Component API Reference

### FormContainer

Main wrapper for form sections.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Form content |
| className | string | '' | Additional classes |

### FormSection

Groups related fields with a title and optional description.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Section heading |
| description | string | - | Optional subtitle |
| icon | ReactNode | - | Icon component |
| children | ReactNode | required | Form fields |
| className | string | '' | Additional classes |

### FormGrid

Responsive grid layout for form fields.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | required | Form fields |
| columns | 1 \| 2 \| 3 | 2 | Number of columns |
| className | string | '' | Additional classes |

### FormField

Individual form field with label, icon, and validation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | required | Field label |
| icon | ReactNode | - | Icon component |
| required | boolean | false | Shows asterisk |
| helper | string | - | Helper text |
| error | string | - | Error message |
| children | ReactNode | required | Input component |
| fullWidth | boolean | false | Span all columns |
| className | string | '' | Additional classes |

## 🎨 Customization

### Changing Colors

The components use Tailwind CSS and Shadcn's design tokens. Customize in `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... other colors
      },
    },
  },
};
```

### Custom Icon Size

```tsx
<FormField
  label="Custom Size"
  icon={<Package className="w-6 h-6" />} // Adjust size
>
  <Input />
</FormField>
```

### Custom Spacing

```tsx
<FormContainer className="space-y-12"> {/* Larger spacing */}
  {/* sections */}
</FormContainer>
```

## 🔧 Additional Utilities

### FormDivider

Add visual separators:

```tsx
import { FormDivider } from '@/components/customs/form-layout';

<FormDivider className="my-8" />
```

### FormFooter

Consistent footer with buttons:

```tsx
import { FormFooter } from '@/components/customs/form-layout';

<FormFooter>
  <Button variant="outline">Cancel</Button>
  <Button type="submit">Save</Button>
</FormFooter>
```

## 📱 Responsive Behavior

- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1024px)**: Two columns
- **Desktop (> 1024px)**: Three columns (when using `columns={3}`)

## 🎭 Recommended Icons

Popular Lucide icons for forms:

```tsx
import {
  Package,      // Products, assets
  FileText,     // Documents, descriptions
  DollarSign,   // Money, pricing
  Hash,         // Numbers, IDs
  Calendar,     // Dates
  Shield,       // Security, warranty
  Factory,      // Manufacturing
  User,         // User info
  Mail,         // Email
  Phone,        // Contact
  MapPin,       // Location
  Building,     // Organization
} from 'lucide-react';
```

## ✅ Best Practices

1. **Group related fields** using `FormSection`
2. **Use meaningful icons** that match field purpose
3. **Provide helper text** for complex fields
4. **Mark required fields** with the `required` prop
5. **Use fullWidth** for text areas and long descriptions
6. **Keep labels concise** and descriptive
7. **Show errors inline** using the `error` prop

## 🐛 Troubleshooting

### Styles not applying

Make sure Tailwind is scanning the form-layout file:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
};
```

### Icons not showing

Verify lucide-react is installed:

```bash
npm install lucide-react
```

### cn function not found

Install required dependencies:

```bash
npm install clsx tailwind-merge
```

## 📚 Resources

- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

---

**Need help?** Check the demo implementation in the artifacts for complete examples!