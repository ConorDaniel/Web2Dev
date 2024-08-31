import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";
import { reportStore } from "./report-store.js";

const db = initStore("stations");

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    const newStation = {
      _id: v4(),
      title: station.title,
      userid: station.userid,
      latitude: String(station.latitude),  
      longitude: String(station.longitude),
    };
    db.data.stations.push(newStation);
    await db.write();
    return newStation;
  },

  async getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    list.reports = await reportStore.getReportsByStationId(list._id);
    return list;
  },

  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    if (index !== -1) {
      db.data.stations.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
  async getStationsByUserId(userid) {
    await db.read();
    return db.data.stations.filter((station) => station.userid === userid);
  },
};