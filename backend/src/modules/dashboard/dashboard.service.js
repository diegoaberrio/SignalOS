import {
  countTotalCompanies,
  countTotalInteractions,
  getPriorityBreakdown,
  getRecentActivity,
} from "./dashboard.repository.js";

export const getDashboardSummary = async () => {
  const [
    totalCompanies,
    totalInteractions,
    priorityRows,
    recentActivityRows,
  ] = await Promise.all([
    countTotalCompanies(),
    countTotalInteractions(),
    getPriorityBreakdown(),
    getRecentActivity(10),
  ]);

  const priorityBreakdown = {
    very_high: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  for (const row of priorityRows) {
    priorityBreakdown[row.current_priority_level] = row.total;
  }

  const recentActivity = recentActivityRows.map((item) => ({
    interaction_id: Number(item.interaction_id),
    company_id: Number(item.company_id),
    company_name: item.company_name,
    submitted_at: item.submitted_at,
    priority_level: item.priority_level_snapshot,
  }));

  return {
    totals: {
      companies: totalCompanies,
      interactions: totalInteractions,
    },
    priority_breakdown: priorityBreakdown,
    recent_activity: recentActivity,
  };
};