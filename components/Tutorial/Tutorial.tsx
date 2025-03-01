'use client'
import dynamic from "next/dynamic"
import { useContext } from "react";
import { GlobalContext } from "../GlobalContextProvider";

const JoyrideNoSSR = dynamic(() => import('react-joyride'), {
    ssr: false
})

export function Tutorial() {
    const { runTour, setRunTour } = useContext(GlobalContext);
    const steps = [
        {
            target: "#tutorial-start",
            content: "Welcome to World Builder! Let's take a quick tour to help you get started.",
            placement: "center" as const,
            disableBeacon: true,
        },
        {
            target: "#create-page-button",
            content: "Create new pages to add content",
            disableBeacon: true,
        },
        {
            target: "#create-folder-button",
            content: "Create new folders to organize your items",
            disableBeacon: true,
        },
        {
            target: "#sidebar-content",
            content: "Click on a folder or page to open it. You can click and drag to rearrange them.",
            disableBeacon: true,
        },
        {
            target: "#tiptap-editor",
            content: "Edit your content using the editor. Try creating / selecting a page to see the magic happen. Enjoy!",
            disableBeacon: true,
        }
    ]

    return (
        <JoyrideNoSSR
            steps={steps}
            continuous={true}
            showSkipButton={true}
            showProgress={true}
            run={runTour}
            disableOverlayClose={true}
            hideBackButton={true}
            locale={{
                last: "Get Started!"
            }}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: 'hsl(var(--primary))',
                    textColor: 'hsl(var(--foreground))',
                },
                tooltip: {
                    backgroundColor: 'hsl(var(--background))',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
                tooltipContainer: {
                    padding: '8px',
                    textAlign: 'left',
                },
                tooltipContent: {
                    color: 'hsl(var(--foreground))',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '4px',
                },
                buttonNext: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    padding: '6px 12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                },
                buttonSkip: {
                    backgroundColor: 'transparent',
                    color: 'hsl(var(--muted-foreground))',
                    border: 'none',
                    padding: '6px 12px',
                    fontSize: '14px',
                    cursor: 'pointer',
                },
                overlay: {
                    backgroundColor: 'transparent',
                },
                spotlight: {
                    backgroundColor: 'transparent',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                },
            }}
            floaterProps={{
                disableAnimation: true,
            }}
            spotlightPadding={4}
            callback={(data) => {
                const { status } = data;
                if (status === 'finished' || status === 'skipped') {
                    setRunTour(false);
                }
            }}
        />
    )
}