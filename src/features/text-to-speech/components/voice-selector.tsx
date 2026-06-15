"use client" ;

import { useEffect } from "react";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { useTTSVoices } from "./tts-voices-context";
import { ttsFormOptions } from "./text-to-speech-form";
import { useStore } from "@tanstack/react-form";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select , SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue} from "@/components/ui/select";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";
import { VOICE_CATEGORY_LABELS } from "@/features/voices/data/voice-categories";

function hasValidVoiceId(id: string | undefined | null): id is string {
    return Boolean(id);
}
 
export function VoiceSelector() {
    const {
        customVoices , 
        systemVoices ,
        allVoices: voices
    } = useTTSVoices() ; 

    const form = useTypedAppFormContext(ttsFormOptions) ;
    const voiceId = useStore(form.store , (s) => s.values.voiceId) ; 
    const isSubmitting = useStore(form.store , (s) => s.isSubmitting) ;
    
    const selectedVoice = voices.find((v) => v.id === voiceId) ;
    const hasMissingSelectedVoice = hasValidVoiceId(voiceId) && !selectedVoice ; 
    const currentVoice = selectedVoice 
        ? selectedVoice 
        : hasMissingSelectedVoice 
            ? {
                id: voiceId  , 
                name: "Unavailable voice" , 
                category: null as null ,
            }
            :voices.find((v) => hasValidVoiceId(v.id));

    const selectableCustomVoices = customVoices.filter((v) => hasValidVoiceId(v.id));
    const selectableSystemVoices = systemVoices.filter((v) => hasValidVoiceId(v.id));

    useEffect(() => {
        if (hasValidVoiceId(voiceId) || voices.length === 0) {
            return;
        }

        const fallbackVoice = voices.find((v) => hasValidVoiceId(v.id));
        if (fallbackVoice) {
            form.setFieldValue("voiceId", fallbackVoice.id);
        }
    }, [voiceId, voices, form]);

    return (
        <Field>
            <FieldLabel>Voice Style</FieldLabel>
            <Select
                value={hasValidVoiceId(voiceId) ? voiceId : undefined}
                onValueChange={(v) => form.setFieldValue("voiceId" , v)}
                disabled={isSubmitting || voices.length === 0}
            >
                <SelectTrigger className="w-full h-auto gap-1 rounded-lg bg-white px-2 py-1">   
                    <SelectValue>
                        {currentVoice && (
                            <>
                                <VoiceAvatar
                                    seed={currentVoice.id}
                                    name={currentVoice.name}
                                />
                                <span className="truncate text-sm font-medium tracking-tight">
                                    {currentVoice.name}
                                    {currentVoice.category && 
                                        ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`
                                    }
                                </span>    
                            </>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {hasMissingSelectedVoice && currentVoice && hasValidVoiceId(currentVoice.id) && (
                        <>
                            <SelectGroup>
                                <SelectLabel>Selected Voice</SelectLabel>
                                <SelectItem value={currentVoice.id}>
                                    <VoiceAvatar 
                                        seed={currentVoice.id}
                                        name={currentVoice.name}
                                    />
                                    <span className="truncate text-sm font-medium tracking-tight">
                                        {currentVoice.name}
                                        {currentVoice.category && 
                                            ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`
                                        }
                                    </span>
                                </SelectItem>
                            </SelectGroup>
                            {(selectableCustomVoices.length > 0 || selectableSystemVoices.length > 0) && (
                                <SelectSeparator />
                            )}
                        </>
                    )}
                    {selectableCustomVoices.length > 0 && (
                        <SelectGroup>
                            <SelectLabel>Team Voices</SelectLabel>
                            {selectableCustomVoices.map((v) => (
                                <SelectItem key={v.id} value={v.id} >
                                    <VoiceAvatar seed={v.id} name={v.name} />
                                    <span className="truncate text-sm font-medium">
                                        {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                    {(selectableCustomVoices.length > 0 || selectableSystemVoices.length > 0) && (
                        <SelectSeparator />
                    )}
                    {selectableSystemVoices.length > 0 && (
                        <SelectGroup>
                            <SelectLabel>System Voices</SelectLabel>
                            {selectableSystemVoices.map((v) => (
                                <SelectItem key={v.id} value={v.id} >
                                    <VoiceAvatar seed={v.id} name={v.name} />
                                    <span className="truncate text-sm font-medium">
                                        {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    )}
                </SelectContent>
            </Select>    
        </Field>
    )
};