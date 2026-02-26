import { render, screen } from "@testing-library/react";

import { SummaryCard } from "@/components/summary-card";

describe("SummaryCard", () => {
  it("renders title, metric, and streak", () => {
    render(
      <SummaryCard
        title="Reading"
        metric="120 pages read"
        streak="Streak: 3 days"
        href="/hobby/reading"
      />,
    );

    expect(screen.getByText("Reading")).toBeInTheDocument();
    expect(screen.getByText("120 pages read")).toBeInTheDocument();
    expect(screen.getByText("Streak: 3 days")).toBeInTheDocument();
  });
});
