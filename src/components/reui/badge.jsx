import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'relative inline-flex shrink-0 items-center justify-center w-fit border border-transparent font-medium whitespace-nowrap outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-3',
  {
    variants: {
      variant: {
        default:            'bg-primary text-primary-foreground',
        outline:            'border-border bg-transparent',
        secondary:          'bg-secondary text-secondary-foreground',
        info:               'bg-info text-white',
        success:            'bg-success text-white',
        warning:            'bg-warning text-white',
        destructive:        'bg-destructive text-white',
        invert:             'bg-invert text-invert-foreground',
        'primary-light':    'bg-primary/10 border-none text-primary',
        'warning-light':    'bg-warning/10 border-none text-warning-foreground',
        'success-light':    'bg-success/10 border-none text-success-foreground',
        'info-light':       'bg-info/10 border-none text-info-foreground',
        'destructive-light':'bg-destructive/10 border-none text-destructive-foreground',
        'invert-light':     'bg-invert/10 border-none text-foreground',
        'primary-outline':  'bg-background border-border text-primary',
        'warning-outline':  'bg-background border-border text-warning-foreground',
        'success-outline':  'bg-background border-border text-success-foreground',
        'info-outline':     'bg-background border-border text-info-foreground',
        'destructive-outline': 'bg-background border-border text-destructive-foreground',
      },
      size: {
        xs:      'px-1 text-[0.6rem] leading-none h-4 min-w-4 gap-1',
        sm:      'px-1 text-[0.625rem] leading-none h-4.5 min-w-4.5 gap-1',
        default: 'px-1.5 py-0.5 text-xs h-5 min-w-5 gap-1',
        lg:      'px-1.5 py-0.5 text-xs h-5.5 min-w-5.5 gap-1',
        xl:      'px-2 py-0.75 text-sm h-6 min-w-6 gap-1.5',
      },
      radius: {
        default: 'rounded-sm',
        full:    'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'default',
      radius:  'default',
    },
  }
)

function Badge({ className, variant, size, radius, asChild, children, ...props }) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, radius }), className)}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
