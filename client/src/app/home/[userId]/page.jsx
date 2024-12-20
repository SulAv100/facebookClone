"use client"
import PostInput from "@/components/postinput";
import Stories from "@/components/stories";
import Post from "@/components/post";
export default function HomePage() {
  const posts = [
    {
      name: "Manita Giri",
      time: "December 14 at 9:11 AM",
      description: "Happy 1st anniversary budu 🌍🤲❤️",
      images: ["/post1.jpg", "/post2.jpg"],
    },
  ];

  return (
    <div className="homepage">
      <PostInput />
      <Stories />
      <div className="posts">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
}
