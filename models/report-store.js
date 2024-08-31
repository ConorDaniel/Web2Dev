import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("reports");

export const reportStore = {
  async getAllReports() {
    await db.read();
    return db.data.reports;
  },

  async addReport(stationId, report) {
    await db.read();
    const newReport = {
      _id: v4(),
      stationid: stationId,
      weatherCode: report.weatherCode,
      maxTemp: report.maxTemp,
      minTemp: report.minTemp,
      maxWind: report.maxWind,
      minWind: report.minWind,
      maxAirP: report.maxAirP,
      minAirP: report.minAirP,
      windDirection: report.windDirection,
      timestamp: report.timestamp,
    };
    db.data.reports.push(newReport);
    await db.write();
    return newReport;
  },

  async getReportsByStationId(id) {
    await db.read();
    return db.data.reports.filter((report) => report.stationid === id);
  },
  
  async getLatestReportByStationId(id) {
    await db.read();
    const reports = db.data.reports.filter((report) => report.stationid === id);
    // Sort reports by timestamp in descending order and return the first one (latest)
    return reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
  },

  async getReportById(id) {
    await db.read();
    return db.data.reports.find((report) => report._id === id);
  },

  async deleteReport(id) {
    await db.read();
    const index = db.data.reports.findIndex((report) => report._id === id);
    if (index !== -1) {
      db.data.reports.splice(index, 1);
      await db.write();
    }
  },

  async deleteAllReports() {
    db.data.reports = [];
    await db.write();
  },

  async updateReport(reportId, updatedReport) {
    await db.read();
    const report = db.data.reports.find((r) => r._id === reportId);
    if (report) {
      report.maxTemp = updatedReport.maxTemp;
      report.minTemp = updatedReport.minTemp;
      report.maxWind = updatedReport.maxWind;
      report.minWind = updatedReport.minWind;
      report.maxAirP = updatedReport.maxAirP;
      report.minAirP = updatedReport.minAirP;
      report.windDirection = updatedReport.windDirection;
      await db.write();
    }
  },
};
