import { FaQuestion } from "react-icons/fa";

export function Tile({ content: Content, flip, state, clicked }) {
  switch (state) {
    case "start":
      return (
        <Back
          className="flex-1 bg-indigo-300 rounded-lg flex justify-center items-center text-white"
          flip={flip}
          clicked={clicked}
        />
      );
    case "flipped":
      return (
        <Front className="flex-1 bg-indigo-500 rounded-lg text-white p-2">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Front>
      );
    case "matched":
      return (
        <Matched className="flex-1 text-indigo-200 rounded-md p-2">
          <Content
            style={{
              display: "inline-block",
              width: "100%",
              height: "100%",
              verticalAlign: "top",
            }}
          />
        </Matched>
      );
    default:
      throw new Error("Invalid state " + state);
  }
}

function Back({ className, flip, clicked }) {
  return (
    <div onClick={flip} className={className}>
      {!clicked && <FaQuestion size={35} />}
    </div>
  );
}

function Front({ className, children }) {
  return <div className={className}>{children}</div>;
}

function Matched({ className, children }) {
  return <div className={className}>{children}</div>;
}
