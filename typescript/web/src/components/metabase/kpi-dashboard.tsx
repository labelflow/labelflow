import * as React from "react";
import { MetabaseDashboard } from "./metabase-dashboard";

export const KPI_DASHBOARD_URL =
  "https://labelflow.metabaseapp.com/public/dashboard/7288172a-11f5-4e71-9651-9ab3cb720136";

export const KpiDashboard = () => (
  <MetabaseDashboard url={KPI_DASHBOARD_URL} title="KPI Dashboard" />
);
