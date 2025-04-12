import ContentLoader from "react-content-loader";

export default function LoadingPricing() {
  return (
    <div className="relative w-full">
      <div className="relative max-w-6xl mx-auto">
        <div className="flex justify-center gap-8 max-w-6xl mx-auto">
          {[1, 2].map((index) => (
            <div key={index} className="w-1/3">
              <div className="border-2 border-neutral-300 rounded-xl pt-8 pb-4 px-8 flex flex-col min-h-[700px] relative overflow-hidden shadow-xl bg-white">
                <ContentLoader
                  speed={2}
                  width={400}
                  height={700}
                  viewBox="0 0 400 700"
                  backgroundColor="#f3f3f3"
                  foregroundColor="#ecebeb"
                  uniqueKey={`pricing-loader-${index}`}
                >
                  {/* Title */}
                  <rect x="100" y="0" rx="4" ry="4" width="200" height="30" />

                  {/* Price */}
                  <rect x="120" y="50" rx="4" ry="4" width="100" height="40" />
                  <rect x="230" y="60" rx="3" ry="3" width="50" height="20" />

                  {/* Features Section Title */}
                  <rect x="0" y="120" rx="3" ry="3" width="250" height="24" />

                  {/* Features List */}
                  <rect x="0" y="164" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="164" rx="3" ry="3" width="280" height="20" />

                  <rect x="0" y="204" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="204" rx="3" ry="3" width="260" height="20" />

                  <rect x="0" y="244" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="244" rx="3" ry="3" width="270" height="20" />

                  <rect x="0" y="284" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="284" rx="3" ry="3" width="250" height="20" />

                  {/* Services Section Title */}
                  <rect x="0" y="344" rx="3" ry="3" width="250" height="24" />

                  {/* Services List */}
                  <rect x="0" y="388" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="388" rx="3" ry="3" width="280" height="20" />

                  <rect x="0" y="428" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="428" rx="3" ry="3" width="260" height="20" />

                  <rect x="0" y="468" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="468" rx="3" ry="3" width="270" height="20" />

                  <rect x="0" y="508" rx="3" ry="3" width="20" height="20" />
                  <rect x="35" y="508" rx="3" ry="3" width="250" height="20" />

                  {/* Button and Link at bottom */}
                  <rect x="25" y="600" rx="4" ry="4" width="250" height="45" />
                  <rect x="25" y="660" rx="3" ry="3" width="250" height="20" />
                </ContentLoader>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
