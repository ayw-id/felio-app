import { useQuery } from "@tanstack/react-query";

export interface Course {
  id: string;
  title: string;
  code: string;
  price: number;
  discount_amount: number;
  type: string;
  status: string;
  created_at: string;
  modified_at: string;
}

interface CoursesResponse {
  success: number;
  msg: string;
  data: {
    courses: Course[];
  };
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch(import.meta.env.VITE_WEBINAR_API + "course");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data: CoursesResponse = await response.json();
  return data.data.courses;
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
};
