'use client'
import { GlobalContext } from "@/components/GlobalContextProvider";
import { useContext } from "react";
import Styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

export default function Home() {
  const { runTour, setRunTour } = useContext(GlobalContext);
  const { state: sidebarState, toggleSidebar, open } = useSidebar();

  return (
    <div id="tiptap-editor" className={`${sidebarState === "collapsed" ? Styles.containerDrawerClosed : Styles.containerDrawerOpen} flex flex-col items-center justify-center h-screen`}>
      <h1 className="text-4xl font-bold">World Builder</h1>
      <h2 className="text-2xl font-bold">Build your world here!</h2>
      {sidebarState === "collapsed" && <Button
        variant="default"
        className="mt-4"
        onClick={() => {
          toggleSidebar();
          if (!open) {
            setRunTour(!runTour);
          }
        }}
      >
        Get Started
      </Button>}
    </div>
  );
}
