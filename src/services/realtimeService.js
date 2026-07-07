import {supabase} from "./supabaseClient.js";
import queueEngine from "./queueEngine.js";

export const createAppointmentChannel = ({filter,onEvent})=>{
    const channelId = filter ? filter.replace(/[^a-zA-Z0-9-_]/g, '-') : Math.random().toString(36).substring(2, 9);
    const channel = supabase
    .channel(`appointments-realtime-${channelId}`)
    .on(
        "postgres_changes",
        {
            event:"*",
            schema:"public",
            table:"Appointment",
            filter
        },
    (payload)=>{

        if(payload.eventType === "INSERT"){
            queueEngine.handleInsert(payload.new);
        }

        if(payload.eventType === "UPDATE"){
            queueEngine.handleUpdate(payload.new);
        }

        if(payload.eventType === "DELETE"){
            queueEngine.handleDelete(payload.old);
        }

        onEvent(payload);
    }
    )
    .subscribe();
    return channel;
};

export const removeChannel = (channel) =>{
    supabase.removeChannel(channel);
};