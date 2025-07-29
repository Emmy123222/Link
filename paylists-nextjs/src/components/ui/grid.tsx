import * as React from "react"
import { cn } from "@/lib/utils"

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16
  autoRows?: boolean
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 4, autoRows = false, ...props }, ref) => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
      7: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-7",
      8: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-8",
      9: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-9",
      10: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-10",
      11: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-11",
      12: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-12",
    }

    const gridGap = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
      16: "gap-16",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          gridCols[cols],
          gridGap[gap],
          autoRows && "auto-rows-auto",
          "animate-in fade-in slide-in-from-bottom-4 duration-500",
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, span = 1, ...props }, ref) => {
    const gridSpan = {
      1: "col-span-1",
      2: "col-span-1 sm:col-span-2",
      3: "col-span-1 sm:col-span-2 lg:col-span-3",
      4: "col-span-1 sm:col-span-2 lg:col-span-4",
      5: "col-span-1 sm:col-span-2 lg:col-span-5",
      6: "col-span-1 sm:col-span-2 lg:col-span-6",
      7: "col-span-1 sm:col-span-2 lg:col-span-7",
      8: "col-span-1 sm:col-span-2 lg:col-span-8",
      9: "col-span-1 sm:col-span-2 lg:col-span-9",
      10: "col-span-1 sm:col-span-2 lg:col-span-10",
      11: "col-span-1 sm:col-span-2 lg:col-span-11",
      12: "col-span-1 sm:col-span-2 lg:col-span-12",
    }

    return (
      <div
        ref={ref}
        className={cn(
          gridSpan[span],
          "animate-in fade-in slide-in-from-bottom-4 duration-500",
          className
        )}
        {...props}
      />
    )
  }
)
GridItem.displayName = "GridItem"

export { Grid, GridItem } 