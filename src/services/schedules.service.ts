import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/lib/api-client";
import { CreateScheduleRequest, Schedule } from "@/types/api";

class SchedulesService {
  private getErrorMessage(error: ApiError): string {
    // Our ApiError exposes: status, message, details
    // Prefer a specific message from details if available
    if (error.details && typeof error.details === "object") {
      const detailsObj = error.details as Record<string, unknown>;
      if (typeof detailsObj["message"] === "string") {
        return detailsObj["message"] as string;
      }
      if (typeof detailsObj["error"] === "string") {
        return detailsObj["error"] as string;
      }
    }
    return error.message || "An unexpected error occurred";
  }

  async createSchedule(scheduleData: CreateScheduleRequest): Promise<string> {
    try {
      const response = await apiClient.post<{ message: string }>(
        "/api/schedules",
        scheduleData
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to create schedule");
    }
  }

  // Note: The backend currently only has a POST endpoint for creating schedules
  // If GET endpoints are added later, we can implement them here
  async getAllSchedules(): Promise<Schedule[]> {
    try {
      // This endpoint doesn't exist yet in the backend
      // We'll need to add it to the ScheduleController
      const response = await apiClient.get<Schedule[]>("/api/schedules");
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to fetch schedules");
    }
  }

  async updateSchedule(
    id: string,
    scheduleData: Partial<CreateScheduleRequest>
  ): Promise<string> {
    try {
      // This endpoint doesn't exist yet in the backend
      const response = await apiClient.put<{ message: string }>(
        `/api/schedules/${id}`,
        scheduleData
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to update schedule");
    }
  }

  async deleteSchedule(id: string): Promise<string> {
    try {
      // This endpoint doesn't exist yet in the backend
      const response = await apiClient.delete<{ message: string }>(
        `/api/schedules/${id}`
      );
      return response.data.message;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(this.getErrorMessage(error));
      }
      throw new Error("Failed to delete schedule");
    }
  }
}

export const schedulesService = new SchedulesService();
