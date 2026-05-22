"use client";

import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "sonner";

export default function Providers({
children,
}) {
return (
<HeroUIProvider>

{children}

<Toaster
position="top-right"
richColors
closeButton
/>

</HeroUIProvider>
);
}
