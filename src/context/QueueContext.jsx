import { createContext, useContext, useEffect, useState } from "react";
import queueEngine from "../services/queueEngine";
import { createAppointmentChannel,removeChannel } from "../services/realtimeService";

const QueueContext = createContext();

export const QueueProvider = ({ children, hospitalId }) => {
  const [queues, setQueues] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let channel;
    async function initQueue() {
      await queueEngine.init();
      const hospitalQueues = queueEngine.getHospitalQueues(hospitalId);
      setQueues(hospitalQueues);
      setLoading(false);

      channel = createAppointmentChannel({
        filter: `hospital_id=eq.${hospitalId}`,
        onEvent: () => {
          const updatedQueues = queueEngine.getHospitalQueues(hospitalId);
          setQueues(updatedQueues);
        }
      });
    }
    initQueue();
    return () => {
      if(channel) removeChannel(channel);
    };
  }, [hospitalId]);

  return (
    <QueueContext.Provider value={{ queues, loading }}>
      {children}
    </QueueContext.Provider>
  );

};

export const useQueue = () => useContext(QueueContext);