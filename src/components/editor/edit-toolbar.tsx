import type { Dispatch, SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { tools } from "~/mockdata";

type EditorToolbarProps = {
  activePanel: string | null;
  setActivePanel: Dispatch<SetStateAction<string | null>>;
};

export default function EditorToolbar({
  activePanel,
  setActivePanel,
}: EditorToolbarProps) {
  return (
    <div className="flex w-20 m-2 rounded-2xl flex-col items-center gap-4 border-r border-slate-200 bg-white/90 py-6 shadow-lg backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/90">
      {tools.map((tool) => (
        <Button
          key={tool.id}
          variant={activePanel === tool.id ? "default" : "ghost"}
          size="icon"
          onClick={() =>
            setActivePanel(activePanel === tool.id ? null : tool.id)
          }
          className={`h-14 w-14 cursor-pointer rounded-xl transition-all duration-200 ${
            activePanel === tool.id
              ? "scale-105 bg-primary text-white shadow-lg hover:bg-primary"
              : "hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-800 dark:hover:text-blue-400"
          }`}
          title={tool.label}
        >
          <tool.icon className="h-6 w-6" />
        </Button>
      ))}
    </div>
  );
}
