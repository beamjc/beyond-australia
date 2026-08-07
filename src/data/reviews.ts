export type Review = {
  id: string;
  name: string;
  rating: number;
  text: string;
  source: "facebook" | "google";
};

// TODO: Replace these placeholders with real quotes copied from
// https://www.facebook.com/BeyondStudyCenter/reviews/ and Beyond Study Center's
// Google Business Profile reviews. Keep wording verbatim to the original review.
export const reviews: Review[] = [
  {
    id: "review-1",
    name: "[ชื่อผู้รีวิว 1]",
    rating: 5,
    text: "[วางข้อความรีวิวจริงจาก Facebook ที่นี่]",
    source: "facebook",
  },
  {
    id: "review-2",
    name: "[ชื่อผู้รีวิว 2]",
    rating: 5,
    text: "[วางข้อความรีวิวจริงจาก Google ที่นี่]",
    source: "google",
  },
  {
    id: "review-3",
    name: "[ชื่อผู้รีวิว 3]",
    rating: 5,
    text: "[วางข้อความรีวิวจริงที่นี่]",
    source: "facebook",
  },
];
