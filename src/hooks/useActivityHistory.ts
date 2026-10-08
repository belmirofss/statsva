import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import API from "../api";
import { SummaryActivity } from "../types";

const PER_PAGE = 200;
const MAX_PAGES = 10;

/** Insights look back to the start of last year, so "this vs last" always has both. */
export const historyStart = () =>
  moment().startOf("year").subtract(1, "year");

/**
 * Every activity since 1 January last year, newest first. One shared query
 * feeds all Insights screens, so opening several of them costs no extra
 * requests against Strava's app-wide rate limit.
 */
export const useActivityHistory = () => {
  return useQuery({
    queryKey: ["ACTIVITY_HISTORY", historyStart().year()],
    queryFn: async () => {
      const after = historyStart().unix();
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
