import '../styles/stories.css'
export default function Stories() {
  const stories = [
    { id: 1, name: "Create Story", isCreateStory: true, image: "https://picsum.photos/1900/1200?random=1" },
    { id: 2, name: "Nicola Tesla", image: "https://picsum.photos/1900/1200?random=2" },
    { id: 3, name: "Lightborn fanny", image: "https://picsum.photos/1900/1200?random=3" },
    { id: 4, name: "Ling", image: "https://picsum.photos/1900/1200?random=4" },
  ];
  
  
  
    return (
      <div className="story-container">
        {stories.map((story) => (
          <div key={story.id} className="story">
            <div className="story-wrapper">
              {story.isCreateStory ? (
                <div className="create-story-box">
                  <span className="create-icon">+</span>
                </div>
              ) : (
                <img
                  src={story.image}
                  alt={story.name}
                  className="story-image"
                />
              )}
            </div>
            <p className="story-name">{story.name}</p>
          </div>
        ))}
      </div>
    );
  }
  