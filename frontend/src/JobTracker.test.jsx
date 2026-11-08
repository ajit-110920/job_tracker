
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobTracker from "./JobTracker";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Job Tracker Authentication", () => {
  it("should display the login screen", () => {
    render(<JobTracker />);

    expect(
      screen.getByRole("heading", { name: "Welcome back" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Sign in" })
    ).toBeInTheDocument();
  });

  it("should switch to the registration screen", async () => {
    const user = userEvent.setup();

    render(<JobTracker />);

    await user.click(
      screen.getByRole("button", { name: "Create one" })
    );

    expect(
      screen.getByRole("heading", { name: "Create an account" })
    ).toBeInTheDocument();
  });
});

describe("Job Tracker Dashboard", () => {
  it("should display jobs for an authenticated user", async () => {
    localStorage.setItem("jobtrack_token", "fake-test-token");

    const mockJobs = [
      {
        id: 1,
        company: "Google",
        role: "Backend Engineer",
        status: "Applied",
        applied_date: "2026-11-08",
      },
    ];

    const mockStats = {
      total: 1,
      interview: 0,
      offers: 0,
    };

    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.includes("/jobs/stats")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockStats),
          });
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockJobs),
        });
      })
    );

    render(<JobTracker />);

    expect(
      await screen.findByText("Backend Engineer")
    ).toBeInTheDocument();

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(
    screen.getByText("Applied", { selector: ".status" })
    ).toBeInTheDocument();  });
});
