/** tone: on | off | neutral */
export default function Tag({ tone = "neutral", children }){
  return <span className={["tag", tone !== "neutral" && `tag--${tone}`].filter(Boolean).join(" ")}>{children}</span>
}
