import api from "./apiWrapper.js"

class QueueEngine {
  constructor() {
    this.appointments = new Map();
    this.queues = new Map();
    this.positions = new Map();
    this.tokens = new Map();
  }

  normalizeApp(app) {
    if (!app) return app;
    const id = app.appointment_id || app.id;
    return {
      ...app,
      id: id,
      appointment_id: id
    };
  }

  async init() {
    const res = await api("GET", "/global/appointments/today");
    const appointments = res.data?.data;
    this.buildQueues(appointments);
    return appointments;
  }

  sortWaitingQueue(h, d) {
    const doctorQueue = this.queues.get(h)?.get(d);
    if (!doctorQueue) return;

    doctorQueue.waiting.sort((a, b) => {
      // emergency first
      if (a.isEmergency !== b.isEmergency) {
        return b.isEmergency - a.isEmergency;
      }
      // then by created_at
      return new Date(a.created_at) - new Date(b.created_at);
    });
  }

  rebuildPositions(hospitalId, doctorId) {
    const doctorQueue = this.queues.get(hospitalId)?.get(doctorId);
    if (!doctorQueue) return;

    // Clear positions for ALL appointments in this doctor's queue
    [...doctorQueue.in_progress, ...doctorQueue.completed, ...doctorQueue.waiting].forEach(app => {
      this.positions.delete(app.appointment_id);
    });

    let currentPosition = 1;

    // Assign position 1 to the in-progress patient if one exists
    doctorQueue.in_progress.forEach(app => {
      this.positions.set(app.appointment_id, currentPosition);
      currentPosition++;
    });

    // Assign subsequent positions to waiting patients
    doctorQueue.waiting.forEach(app => {
      this.positions.set(app.appointment_id, currentPosition);
      currentPosition++;
    });
  }

  rebuildTokenNumbers(hospitalId, doctorId) {
    const doctorQueue = this.queues.get(hospitalId)?.get(doctorId);
    if (!doctorQueue) return;

    const allApps = [
      ...doctorQueue.in_progress,
      ...doctorQueue.completed,
      ...doctorQueue.waiting
    ];

    // Sort chronologically by created_at
    allApps.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    allApps.forEach((app, index) => {
      const tokenVal = app.token ?? app.token_no ?? app.token_number ?? (index + 1);
      const app_id = app.appointment_id || app.id;
      this.tokens.set(app_id, tokenVal);
    });
  }

  getPatientToken(appointmentId) {
    const t = this.tokens.get(appointmentId);
    if (!t) return null;
    return typeof t === 'string' && t.startsWith('Q-') ? t : `Q-${t}`;
  }

  buildQueues(appointments) {
    this.appointments.clear();
    this.queues.clear();
    this.tokens.clear();
    if (!appointments) return;

    appointments.forEach(rawApp => {
      const app = this.normalizeApp(rawApp);
      this.appointments.set(app.appointment_id, app);

      const hospitalId = app.hospital_id;
      const doctorId = app.assigned_doctor;

      if (!this.queues.has(hospitalId)) {
        this.queues.set(hospitalId, new Map());
      }

      const hospitalQueues = this.queues.get(hospitalId);

      if (!hospitalQueues.has(doctorId)) {
        hospitalQueues.set(doctorId, {
          in_progress: [],
          waiting: [],
          completed: []
        });
      }

      const doctorQueue = hospitalQueues.get(doctorId);
      doctorQueue[app.status].push(app);
    });

    this.queues.forEach((hospital, hospitalId) => {
      hospital.forEach((_, doctorId) => {
        this.sortWaitingQueue(hospitalId, doctorId);
        this.rebuildPositions(hospitalId, doctorId);
        this.rebuildTokenNumbers(hospitalId, doctorId);
      });
    });
  }

  handleInsert(rawApp) {
    const app = this.normalizeApp(rawApp);
    this.appointments.set(app.appointment_id, app);

    const h = app.hospital_id;
    const d = app.assigned_doctor;

    if (!this.queues.has(h)) {
      this.queues.set(h, new Map());
    }

    const hospital = this.queues.get(h);

    if (!hospital.has(d)) {
      hospital.set(d, {
        in_progress: [],
        waiting: [],
        completed: []
      });
    }

    hospital.get(d)[app.status].push(app);

    if (app.status === "waiting") {
      this.sortWaitingQueue(h, d);
    }
    this.rebuildPositions(h, d);
    this.rebuildTokenNumbers(h, d);
  }

  handleUpdate(rawApp) {
    const newApp = this.normalizeApp(rawApp);
    const oldApp = this.appointments.get(newApp.appointment_id);
    if (!oldApp) return;

    const h = oldApp.hospital_id;
    const d = oldApp.assigned_doctor;

    const doctorQueue = this.queues.get(h)?.get(d);
    if (!doctorQueue) return;

    const oldList = doctorQueue[oldApp.status];
    const index = oldList.findIndex(
      a => (a.appointment_id || a.id) === oldApp.appointment_id
    );

    if (index !== -1) {
      oldList.splice(index, 1);
    }

    doctorQueue[newApp.status].push(newApp);

    if (newApp.status === "waiting") {
      this.sortWaitingQueue(h, d);
    }
    this.rebuildPositions(h, d);
    this.rebuildTokenNumbers(h, d);
    this.appointments.set(newApp.appointment_id, newApp);
  }

  handleDelete(rawApp) {
    const app = this.normalizeApp(rawApp);
    const h = app.hospital_id;
    const d = app.assigned_doctor;

    const doctorQueue = this.queues.get(h)?.get(d);
    if (!doctorQueue) return;

    const list = doctorQueue[app.status];
    const index = list.findIndex(
      a => (a.appointment_id || a.id) === app.appointment_id
    );

    if (index !== -1) {
      list.splice(index, 1);
    }
    this.rebuildPositions(h, d);
    this.rebuildTokenNumbers(h, d);
    this.tokens.delete(app.appointment_id);
    this.appointments.delete(app.appointment_id);
  }

  getDoctorQueue(hospitalId, doctorId) {
    const hospital = this.queues.get(hospitalId);
    if (!hospital) return [];

    const doctorQueue = hospital.get(doctorId);
    if (!doctorQueue) return [];

    return [
      ...doctorQueue.in_progress,
      ...doctorQueue.waiting
    ];
  }

  getHospitalQueues(hospitalId) {
    const hospital = this.queues.get(hospitalId);
    if (!hospital) return {};

    const result = {};
    hospital.forEach((queue, doctorId) => {
      result[doctorId] = [
        ...queue.in_progress,
        ...queue.waiting
      ];
    });

    return result;
  }

  getPatientPosition(appointmentId) {
    return this.positions.get(appointmentId) || null;
  }
}

export default new QueueEngine();