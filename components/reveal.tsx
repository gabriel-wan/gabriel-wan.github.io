import { Fragment, cloneElement, isValidElement, type ElementType, type ReactElement, type ReactNode } from "react";

const STEP = 24; // ms between words
const MAX_DELAY = 650; // cap, so long paragraphs don't take forever
const DURATION = 750;

type Counter = { n: number };

function word(content: ReactNode, counter: Counter, key: number | string) {
  const delay = Math.min(counter.n++ * STEP, MAX_DELAY);
  return (
    <span className="rw" key={key}>
      <span className="rw-i" style={{ transitionDelay: `${delay}ms` }}>{content}</span>
    </span>
  );
}

// Wrap every word in a mask. Links inside paragraphs and inline code move as one
// piece, so underlines and code backgrounds stay intact.
function split(node: ReactNode, counter: Counter, inHeading: boolean): ReactNode {
  if (typeof node === "string" || typeof node === "number") {
    return String(node)
      .split(/(\s+)/)
      .map((part, i) => (!part ? null : /^\s+$/.test(part) ? part : word(part, counter, i)));
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => <Fragment key={i}>{split(child, counter, inHeading)}</Fragment>);
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    if (el.type === "code" || (el.type === "a" && !inHeading)) return word(el, counter, "atom");
    return cloneElement(el, undefined, split(el.props.children, counter, inHeading));
  }
  return node;
}

// A heading or intro paragraph whose words slide up out of a mask the first time
// it scrolls into view (components/reveal-observer.tsx adds .in).
export function Reveal({
  as: Tag = "p",
  className,
  children,
  ...rest
}: { as?: ElementType; className?: string; children: ReactNode } & Record<string, unknown>) {
  const counter = { n: 0 };
  const words = split(children, counter, typeof Tag === "string" && /^h[1-6]$/.test(Tag));
  const total = Math.min(counter.n * STEP, MAX_DELAY) + DURATION;
  return (
    <Tag className={className ? `${className} split` : "split"} data-reveal-ms={total} {...rest}>
      {words}
    </Tag>
  );
}
