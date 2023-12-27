import { useEffect, useState } from "react";
import r2wc from "@r2wc/react-to-web-component";

function Counter({ count }: { count: number }) {
  const [currentCount, setCount] = useState(0);

  useEffect(() => {
    setCount(count);
  }, [count])

  return (
    <button
      onClick={() => {
        setCount(currentCount + 1);
      }}
    >
      Count: {currentCount}
    </button>
  );
}

const WebApp = r2wc(Counter, {
  props: {
    count: "number",
  },
});

customElements.define("my-react-element", WebApp);

export default Counter;
