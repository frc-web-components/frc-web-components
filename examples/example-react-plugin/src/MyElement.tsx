import { useEffect, useState } from "react";
import r2wc from "@r2wc/react-to-web-component";
import { getAssetUrl } from "@frc-web-components/app";

function MyElement({ count }: { count: number }) {
  const [currentCount, setCount] = useState(0);

  useEffect(() => {
    setCount(count);
  }, [count]);

  return (
    <button
      style={{
        padding: "8px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
      onClick={() => {
        setCount(currentCount + 1);
      }}
    >
      <img src={getAssetUrl("party.svg")} alt="party time" />
      Party Gusts: {currentCount}
    </button>
  );
}

const WebApp = r2wc(MyElement, {
  props: {
    count: "number",
  },
});

customElements.define("my-react-element", WebApp);

export default MyElement;
