import { useQuery } from "@tanstack/react-query";
import { Course } from "./useCourses";

interface CoursesResponse {
  success: number;
  msg: string;
  data: {
    courses: Course[];
  };
}

const fetchSelectedCourses = async (courseIds: string[]): Promise<Course[]> => {
  if (courseIds.length === 0) return [];
  
  const response = await fetch(import.meta.env.VITE_WEBINAR_API + "course", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      courseIds: JSON.stringify(courseIds),
    }),
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  
  const data: CoursesResponse = await response.json();
  return data.data.courses;
};

export const useSelectedCourses = (shouldSkip: boolean) => {
  const storedCourses = localStorage.getItem("selectedCourses");
  const courseIds: string[] = storedCourses ? JSON.parse(storedCourses) : [];

  return useQuery({
    queryKey: ["selectedCourses", courseIds],
    queryFn: () => fetchSelectedCourses(courseIds),
    // Only run if there are IDs AND we aren't skipping it due to invCode
    enabled: courseIds.length > 0 && !shouldSkip,
  });
};