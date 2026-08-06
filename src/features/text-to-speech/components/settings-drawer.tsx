import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

import { SettingsPanelSettings } from "./settings-panel-settings";

interface SettingsDrawerProps {
    open?: boolean ; 
    onOpenChange?: (open: boolean) => void ; 
    children?: React.ReactNode ;  
}

export function SettingsDrawer({
    open , 
    onOpenChange , 
    children , 
} : SettingsDrawerProps) {
    return(
        <Drawer open={open} onOpenChange={onOpenChange}>
            {children ?? (
                <DrawerTrigger asChild>
                    <Button variant="outline" size="sm" >
                        <History className="size-4" />
                    </Button>
                </DrawerTrigger>
            )}
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>History</DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto">
                    <SettingsPanelSettings />
                </div>
            </DrawerContent>
        </Drawer>
    );
};