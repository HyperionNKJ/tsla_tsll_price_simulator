import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        // ==== OUTLINE (light) ====
        outlineRed:     "border border-red-300 text-red-700 hover:bg-red-50",
        outlineOrange:  "border border-orange-300 text-orange-700 hover:bg-orange-50",
        outlineYellow:  "border border-yellow-300 text-yellow-800 hover:bg-yellow-50",
        outlineLime:    "border border-lime-300 text-lime-800 hover:bg-lime-50",
        outlineGreen:   "border border-green-300 text-green-700 hover:bg-green-50",
        outlineEmerald: "border border-emerald-300 text-emerald-700 hover:bg-emerald-50",
        outlineTeal:    "border border-teal-300 text-teal-700 hover:bg-teal-50",
        outlineCyan:    "border border-cyan-300 text-cyan-700 hover:bg-cyan-50",
        outlineSky:     "border border-sky-300 text-sky-700 hover:bg-sky-50",
        outlineBlue:    "border border-blue-300 text-blue-700 hover:bg-blue-50",
        outlineIndigo:  "border border-indigo-300 text-indigo-700 hover:bg-indigo-50",
        outlineViolet:  "border border-violet-300 text-violet-700 hover:bg-violet-50",
        outlinePurple:  "border border-purple-300 text-purple-700 hover:bg-purple-50",
        outlineFuchsia: "border border-fuchsia-300 text-fuchsia-700 hover:bg-fuchsia-50",
        outlinePink:    "border border-pink-300 text-pink-700 hover:bg-pink-50",
        outlineRose:    "border border-rose-300 text-rose-700 hover:bg-rose-50",
        outlineGray:    "border border-slate-400 text-slate-700 hover:bg-slate-100",

        // ==== SOFT (tinted fill) ====
        softRed:     "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
        softOrange:  "border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100",
        softYellow:  "border border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
        softLime:    "border border-lime-200 bg-lime-50 text-lime-800 hover:bg-lime-100",
        softGreen:   "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
        softEmerald: "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
        softTeal:    "border border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100",
        softCyan:    "border border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100",
        softSky:     "border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
        softBlue:    "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
        softIndigo:  "border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100",
        softViolet:  "border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100",
        softPurple:  "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100",
        softFuchsia: "border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100",
        softPink:    "border border-pink-200 bg-pink-50 text-pink-700 hover:bg-pink-100",
        softRose:    "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
        softGray:    "border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200",

        // ==== SOLID (filled) ====
        // (Yellow/lime use dark text for contrast; others use white)
        solidRed:     "bg-red-600 text-white hover:bg-red-700",
        solidOrange:  "bg-orange-600 text-white hover:bg-orange-700",
        solidYellow:  "bg-yellow-500 text-black hover:bg-yellow-600",
        solidLime:    "bg-lime-500 text-black hover:bg-lime-600",
        solidGreen:   "bg-green-600 text-white hover:bg-green-700",
        solidEmerald: "bg-emerald-600 text-white hover:bg-emerald-700",
        solidTeal:    "bg-teal-600 text-white hover:bg-teal-700",
        solidCyan:    "bg-cyan-600 text-white hover:bg-cyan-700",
        solidSky:     "bg-sky-600 text-white hover:bg-sky-700",
        solidBlue:    "bg-blue-600 text-white hover:bg-blue-700",
        solidIndigo:  "bg-indigo-600 text-white hover:bg-indigo-700",
        solidViolet:  "bg-violet-600 text-white hover:bg-violet-700",
        solidPurple:  "bg-purple-600 text-white hover:bg-purple-700",
        solidFuchsia: "bg-fuchsia-600 text-white hover:bg-fuchsia-700",
        solidPink:    "bg-pink-600 text-white hover:bg-pink-700",
        solidRose:    "bg-rose-600 text-white hover:bg-rose-700"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
