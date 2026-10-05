import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import API from "../api";
import { SummaryActivity } from "../types";
import { RECENT_WEEKS } from "../constants";

const PER_PAGE = 200;
const MAX_PAGES = 5;

export const recentWeeksStart = () =>
  moment()
    .startOf("isoWeek")
    .subtract(RECENT_WEEKS - 1, "weeks");

/**
 * Every activity since the start of the 12-week window, newest first.
 * Strava returns `after` queries oldest first, so the result is re-sorted.
 */
export const useRecentActivities = () => {
  return useQuery({
    queryKey: ["RECENT_ACTIVITIES", RECENT_WEEKS],
    queryFn: async () => {
      const after = recentWeeksStart().unix();
      const activities: SummaryActivity[] = [];

      for (let page = 1; page <= MAX_PAGES; page++) {
        const { data } = await API.get<SummaryActivity[]>(
          `athlete/activities`,
          { params: { after, page, per_page: PER_PAGE } }
        );
        activities.push(...data);

        if (data.length < PER_PAGE) {
          break;
        }
      }

      return activities.sort((a, b) => b.start_date.localeCompare(a.start_date));
    },
  });
};
