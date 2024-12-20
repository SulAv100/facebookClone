import '../styles/stories.css'
export default function Stories() {
    const stories = [
      { id: 1, name: "Create Story", isCreateStory: true },
      { id: 2, name: "Srijana Danuwar", image: "https://via.placeholder.com/130x200" },
      { id: 3, name: "Manish Giri", image: "https://via.placeholder.com/130x200" },
      { id: 4, name: "Binisa Aate Magar", image: "https://via.placeholder.com/130x200" },
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
  