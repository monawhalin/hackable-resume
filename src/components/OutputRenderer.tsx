import { TerminalLine } from "@/terminal/types";

export default function OutputRenderer({ line }: { line: TerminalLine }) {
  if (line.html) {
    return <div className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: line.text }} />;
  }
  return <div className="whitespace-pre-wrap break-words">{line.text}</div>;
}
