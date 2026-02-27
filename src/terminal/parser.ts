export type ParsedCommand = { command: string; args: string[]; raw: string };

export const parseCommand = (rawInput: string): ParsedCommand => {
  const raw = rawInput.trim();
  if (!raw) return { command: "", args: [], raw };
  const matches = raw.match(/"([^"]*)"|'([^']*)'|\S+/g) ?? [];
  const tokens = matches.map((m) => m.replace(/^['"]|['"]$/g, ""));
  return { command: (tokens[0] ?? "").toLowerCase(), args: tokens.slice(1), raw };
};
