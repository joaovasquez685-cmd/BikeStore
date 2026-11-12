import { Link } from "react-router-dom"

/**
 * variant: primary | ghost | ghost-light | light  ·  size: md | lg  ·  full: ancho completo
 * Con `to` se renderiza como <Link>; con `href` como <a>; si no, como <button>.
 */
export default function Button({ variant = "primary", size = "md", full = false, to, href, className = "", type = "button", children, ...rest }){
  const cls = ["btn",
    variant !== "primary" && `btn--${variant}`,
    size === "lg" && "btn--lg",
    full && "btn--full",
    className].filter(Boolean).join(" ")
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button type={type} className={cls} {...rest}>{children}</button>
}
