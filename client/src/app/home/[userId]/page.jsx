"use client"
import PostInput from "@/components/postinput";
import Stories from "@/components/stories";
import Post from "@/components/post";
export default function HomePage() {
  const posts = [
    {
      name: "Albert Einstein",
      time: "December 14 at 9:11 AM",
      description: "K xa ta sathi haru",
      images: [
        "https://picsum.photos/1900/1200?random=1", 
        "https://picsum.photos/1900/1200?random=2"
      ],
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
