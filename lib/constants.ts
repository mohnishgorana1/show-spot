import { FormControl } from "@/types/index";

//                        onboard
export const initialOnboardFormData = {
  role: "STUDENT",
  name: "",
};
export const onboardFormControls: FormControl[] = [
  {
    componentType: "SELECT",
    name: "role",
    label: "Role",
    type: "select",
    placeholder: "Select your Role",
    options: [
      { label: "Student", value: "STUDENT" },
      { label: "Instructor", value: "INSTRUCTOR" },
    ],
    required: true,
  },
  {
    componentType: "INPUT",
    name: "name",
    label: "Name",
    placeholder: "Enter your name",
    type: "text",
    required: true,
  },
];

//                        create course
export const initialCreateCourseFormData = {
  title: "",
  description: "",
  category: "",
  welcomeMessage: "",
  pricing: 0,
  courseThumbnail: null
};

export const createCourseFormControls: FormControl[] = [
  {
    componentType: "INPUT",
    name: "title",
    label: "Title",
    placeholder: "Select Course Title",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "description",
    label: "Description",
    placeholder: "Enter Course Description",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "category",
    label: "Category",
    placeholder: "Enter Course Category",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "welcomeMessage",
    label: "Welcome Message",
    placeholder: "Set a Welcome Message",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "pricing",
    label: "Price (INR)",
    placeholder: "Set a Course Price (INR)",
    type: "number",
    required: true,
  },
  {
    componentType: "FILE",
    name: "courseThumbnail",
    label: "Course Thumbnail",
    required: true,
  },
];




//                      update course
export const updateCourseDetailsFormControls: FormControl[] = [
  {
    componentType: "INPUT",
    name: "title",
    label: "Title",
    placeholder: "Select Course Title",
    type: "text",
    required: true,
    disabled: true,
  },
  {
    componentType: "INPUT",
    name: "description",
    label: "Description",
    placeholder: "Enter Course Description",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "category",
    label: "Category",
    placeholder: "Enter Course Category",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "welcomeMessage",
    label: "Welcome Message",
    placeholder: "Set a Welcome Message",
    type: "text",
    required: true,
  },
  {
    componentType: "INPUT",
    name: "pricing",
    label: "Price (INR)",
    placeholder: "Set a Course Price (INR)",
    type: "number",
    required: true,
  },
];
