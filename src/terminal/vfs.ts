import resume from "@/content/resume.json";
import { Layer, VNode } from "./types";

const projectFiles = resume.projects.reduce<Record<string, VNode>>((acc, project) => {
  acc[`${project.slug}.md`] = {
    name: `${project.slug}.md`,
    path: `/home/guest/projects/${project.slug}.md`,
    type: "file",
    lockedBy: "projects",
    content: `# ${project.name}\n\n${project.description}\n\nTech: ${project.tech.join(", ")}\n\nHighlights:\n${project.highlights.map((h) => `- ${h}`).join("\n")}`
  };
  return acc;
}, {});

export const createInitialVfs = (): VNode => ({
  name: "/",
  path: "/",
  type: "dir",
  children: {
    home: {
      name: "home",
      path: "/home",
      type: "dir",
      children: {
        guest: {
          name: "guest",
          path: "/home/guest",
          type: "dir",
          children: {
            "identity.lock": { name: "identity.lock", type: "file", path: "/home/guest/identity.lock", content: "Encrypted identity module", lockedBy: "identity" },
            "skills.enc": { name: "skills.enc", type: "file", path: "/home/guest/skills.enc", content: "Encrypted skills module", lockedBy: "skills" },
            projects: { name: "projects", path: "/home/guest/projects", type: "dir", children: projectFiles },
            logs: {
              name: "logs",
              path: "/home/guest/logs",
              type: "dir",
              children: {
                "scan.log": { name: "scan.log", type: "file", path: "/home/guest/logs/scan.log", content: "Locked modules: identity, skills, projects, vision" }
              }
            },
            ".future": {
              name: ".future",
              path: "/home/guest/.future",
              hidden: true,
              type: "dir",
              children: {
                "vision.md": {
                  name: "vision.md",
                  path: "/home/guest/.future/vision.md",
                  type: "file",
                  lockedBy: "vision",
                  content: "# Vision\nBuild humane AI systems that elevate teams without dehumanizing work."
                }
              }
            }
          }
        }
      }
    }
  }
});

export const normalizePath = (cwd: string, input?: string): string => {
  const raw = !input || input === "~" ? "/home/guest" : input;
  const merged = raw.startsWith("/") ? raw : `${cwd}/${raw}`;
  const parts = merged.split("/").filter(Boolean);
  const stack: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") {
      stack.pop();
      continue;
    }
    stack.push(part);
  }
  return `/${stack.join("/")}` || "/";
};

export const getNode = (root: VNode, path: string): VNode | null => {
  if (path === "/") return root;
  const parts = path.split("/").filter(Boolean);
  let current: VNode = root;
  for (const part of parts) {
    if (!current.children?.[part]) return null;
    current = current.children[part];
  }
  return current;
};

export const listDir = (root: VNode, cwd: string, pathArg?: string, showAll?: boolean): string[] => {
  const path = normalizePath(cwd, pathArg);
  const node = getNode(root, path);
  if (!node || node.type !== "dir") return ["Directory not found"]; 
  return Object.values(node.children ?? {})
    .filter((child) => showAll || !child.hidden)
    .map((child) => child.name)
    .sort();
};

export const unlockLayer = (root: VNode, layer: Layer): void => {
  const walk = (node: VNode) => {
    if (node.lockedBy === layer) delete node.lockedBy;
    Object.values(node.children ?? {}).forEach(walk);
  };
  walk(root);

  const guest = getNode(root, "/home/guest");
  if (!guest?.children) return;
  if (layer === "identity") {
    guest.children["identity.txt"] = {
      name: "identity.txt",
      path: "/home/guest/identity.txt",
      type: "file",
      content: `Name: ${resume.basics.name}\nHeadline: ${resume.basics.headline}\nLocation: ${resume.basics.location}`
    };
  }
  if (layer === "skills") {
    guest.children["skills.txt"] = {
      name: "skills.txt",
      path: "/home/guest/skills.txt",
      type: "file",
      content: Object.entries(resume.skills).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n")
    };
  }
};
