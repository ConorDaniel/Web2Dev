import { stationStore } from "../models/station-store.js";
import { reportStore } from "../models/report-store.js";
import { accountsController } from "./accounts-controller.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const reports = await reportStore.getReportsByStationId(station._id);
    const latestReport = await reportStore.getLatestReportByStationId(station._id); // Get the latest report
    const user = await accountsController.getLoggedInUser(request);
    console.log("Station data:", station);
    const viewData = {
      title: "Station",
      station: station,
      reports: reports,
      latestReport: latestReport, // Pass the latest report to the view
      userEmail: user.email,
    };
    response.render("station-view", viewData);
  },

  async addReport(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const now = new Date();
    const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString(); 
    const newReport = {
      weatherCode: request.body.weatherCode,
      maxTemp: Number(request.body.maxTemp),
      minTemp: Number(request.body.minTemp),
      maxWind: Number(request.body.maxWind),
      minWind: Number(request.body.minWind),
      maxAirP: Number(request.body.maxAirP),
      minAirP: Number(request.body.minAirP),
      windDirection: request.body.windDirection,
      timestamp: timestamp
    };
    console.log(`Adding weather report for station ${station._id}`);
    await reportStore.addReport(station._id, newReport);
    response.redirect("/station/" + station._id);
  },

  async deleteReport(request, response) {
    const stationId = request.params.stationid;
    const reportId = request.params.reportid;
    console.log(`Deleting Report ${reportId} from Station ${stationId}`);
    await reportStore.deleteReport(reportId);
    response.redirect("/station/" + stationId);
  },
};
