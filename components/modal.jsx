import { useEffect, useRef } from "react";

export function useOnClickOutside(refs, handler) {
  useEffect(() => {
    function listener(event) {
      if (refs.some(ref => !ref.current || ref.current.contains(event.target))) return;
      handler(event);
    }
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [refs, handler]);
}

export default function Modal({ children, isOpen, handler }) {
  const ref = useRef(null);
  useOnClickOutside([ref], handler);

  if (!isOpen) return <></>;

  return (
    <div id="modal">
      <div ref={ref}>
        {children}
      </div>
    </div>
  );
}
