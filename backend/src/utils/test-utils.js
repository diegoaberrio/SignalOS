import { parsePagination, buildPaginationMeta } from "./pagination.js";
import { normalizeCompanyName } from "./normalize.js";
import { calculateInitialPriority } from "./scoring.js";

export const runUtilsSmokeTest = () => {
  const pagination = parsePagination({ page: "2", page_size: "10" });
  const paginationMeta = buildPaginationMeta({
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalItems: 47,
  });

  const normalizedCompanyName = normalizeCompanyName("  Señal Óptima S.L.  ");

  const priority = calculateInitialPriority({
    intentionCode: "find_opportunity",
    hasBusinessEmail: true,
    hasBusinessPhone: true,
    hasWebsite: true,
    repetitionCount: 2,
    depthScore: 3,
  });

  console.log("Utils smoke test:");
  console.log({ pagination });
  console.log({ paginationMeta });
  console.log({ normalizedCompanyName });
  console.log({ priority });
};