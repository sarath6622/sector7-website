import { cn } from "@/lib/utils";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "whatsapp";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  external?: boolean;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:   "bg-accent hover:bg-accent-hover text-white accent-glow",
  secondary: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-bg-primary",
  ghost:     "bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-white",
  whatsapp:  "text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-xs px-4 py-2 tracking-widest",
  md: "text-sm px-6 py-3 tracking-widest",
  lg: "text-sm px-8 py-4 tracking-widest",
};

const BASE = "inline-flex items-center justify-center font-body font-semibold uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

/**
 * Core Button component.
 * Renders as <button> by default, or <a> / Next.js <Link> when href is provided.
 *
 * Variants: primary | secondary | ghost | whatsapp
 * Sizes: sm | md | lg
 */
export function Button(props: ButtonProps) {
  const {
    variant  = "primary",
    size     = "md",
    className,
    children,
    disabled,
  } = props;

  const classes = cn(
    BASE,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  // WhatsApp button gets its own inline bg color (not a CSS var, avoids theming issues)
  const waStyle =
    variant === "whatsapp"
      ? { backgroundColor: "#25D366" }
      : undefined;

  if (props.href !== undefined) {
    const isExternal = "external" in props && props.external;
    return (
      <Link
        href={props.href}
        className={classes}
        style={waStyle}
        aria-label={props["aria-label"]}
        onClick={props.onClick}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={classes}
      style={waStyle}
      disabled={disabled}
      onClick={props.onClick}
      aria-label={props["aria-label"]}
    >
      {children}
    </button>
  );
}
