import {supabase} from "./supabaseClient.js";
import queueEngine from "./queueEngine.js";

export const createAppointmentChannel = ({filter,onEvent})=>{
    const channel = supabase
    .channel("appointments-realtime")
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