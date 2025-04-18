import * as LabelPrimitive from "@radix-ui/react-label";

import * as React from "react";

import { cn } from "~/lib/utils";

function Label({
  className,
  required,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & { required?: boolean }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-sm font-heading leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
        required ? "after:content-['_*']" : ''
      )}
      {...props}
    >
      {props.children}
    </LabelPrimitive.Root>
  );
}

export { Label };
