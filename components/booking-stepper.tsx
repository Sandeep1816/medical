import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookingStepperProps {
  currentStep: number
}

export function BookingStepper({ currentStep }: BookingStepperProps) {
  const steps = [
    { id: 1, name: "Choose session details" },
    { id: 2, name: "Enter your details" },
    { id: 3, name: "Complete your booking" },
  ]

  return (
    <div className="relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <ol className="relative grid grid-cols-3 w-full">
        {steps.map((step) => (
          <li key={step.id} className="relative flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background z-10",
                currentStep >= step.id ? "border-primary" : "border-muted",
                currentStep > step.id && "bg-primary",
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-4 w-4 text-white" />
              ) : (
                <span
                  className={cn(
                    "text-sm font-medium",
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {step.id}
                </span>
              )}
            </div>
            <span
              className={cn(
                "mt-2 text-xs text-center",
                currentStep >= step.id ? "text-primary font-medium" : "text-muted-foreground",
              )}
            >
              {step.name}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
