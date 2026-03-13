import {supabase} from "./supabaseClient.js";

export const createAppointmentChannel = ({filter,onEvent})=>{
    const channel = supabase
    .channel(`appointments-${Date.now()}`)
    .on(
        "postgres_changes",
        {
            event:"*",
            schema:"public",
            table:"Appointment",
            filter
        },
        (payload)=>{
            onEvent(payload);
        }
    )
    .subscribe();
    return channel;
};

export const removeChannel = (channel) =>{
    supabase.removeChannel(channel);
};