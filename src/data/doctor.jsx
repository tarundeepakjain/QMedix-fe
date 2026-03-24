import { useEffect, useState } from "react";
import api from "../services/apiWrapper";

export const useDoctors=(hospitalId)=>{
const [doctorMap,setDoctorMap]=useState({});
const fetch = async () => {
  try {
    console.log("Hospital id:",hospitalId);

   const res=await api("get",`doctor/all/${hospitalId}`);
  //  console.log(res.data.doctors);
   const map={};
   res.data.doctors.forEach(d=>{
    map[d.id]=d;
   })
   setDoctorMap(map);
  } catch (error) {
    console.error("doctor fetching error:",error);
  }
};
 useEffect(()=>{
  
  fetch();
 },[hospitalId])
const getDoctor=(id)=>{
   return doctorMap[id];
}
return {doctorMap,getDoctor};
 }


