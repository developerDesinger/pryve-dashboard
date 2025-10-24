import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loader({ size = "md", className, text }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div
        className={cn(
          "border-2 border-primary border-t-transparent rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}

interface PageLoaderProps {
  text?: string;
}

export function PageLoader({ text = "Loading..." }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader size="lg" text={text} />
    </div>
  );
}

interface ButtonLoaderProps {
  className?: string;
}

export function ButtonLoader({ className }: ButtonLoaderProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

interface InlineLoaderProps {
  className?: string;
}

export function InlineLoader({ className }: InlineLoaderProps) {
  return (
    <div
      className={cn(
        "w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin",
        className
      )}
    />
  );
}
