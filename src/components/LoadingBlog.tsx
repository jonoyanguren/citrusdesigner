import ContentLoader from "react-content-loader";

export default function LoadingBlog() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid gap-12">
        {[1, 2, 3].map((index) => (
          <div key={index} className="group">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <ContentLoader
                  speed={2}
                  width={600}
                  height={200}
                  viewBox="0 0 600 200"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  uniqueKey={`blog-loader-${index}`}
                >
                  {/* Title */}
                  <rect x="0" y="0" rx="4" ry="4" width="400" height="32" />

                  {/* Excerpt */}
                  <rect x="0" y="50" rx="3" ry="3" width="500" height="20" />
                  <rect x="0" y="80" rx="3" ry="3" width="450" height="20" />

                  {/* Author and Date */}
                  <rect x="0" y="120" rx="3" ry="3" width="100" height="16" />
                  <rect x="120" y="120" rx="3" ry="3" width="80" height="16" />

                  {/* Tags */}
                  <rect x="0" y="150" rx="3" ry="3" width="60" height="24" />
                  <rect x="70" y="150" rx="3" ry="3" width="60" height="24" />
                  <rect x="140" y="150" rx="3" ry="3" width="60" height="24" />
                </ContentLoader>
              </div>

              {/* Image placeholder */}
              <div className="md:w-1/3 relative aspect-video">
                <ContentLoader
                  speed={2}
                  width={300}
                  height={200}
                  viewBox="0 0 300 200"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  uniqueKey={`blog-image-loader-${index}`}
                >
                  <rect x="0" y="0" rx="4" ry="4" width="300" height="200" />
                </ContentLoader>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
