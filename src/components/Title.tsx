export default function Title({
  title,
  description = "",
  highlightIndexes = [],
}: {
  title: string;
  description?: string;
  highlightIndexes?: number[];
}) {
  const highlightTitle = (text: string) => {
    const words = text.split(" ");
    return words.map((word, index) => (
      <span
        key={index}
        className={`${
          highlightIndexes.includes(index) ? "text-orange-400" : ""
        }`}
      >
        {word}
        {index < words.length - 1 ? " " : ""}
      </span>
    ));
  };

  return (
    <div className="text-gray-900 p-2 md:p-8 mx-0 md:mx-auto md:max-w-4xl mt-12 md:my-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-2 md:mb-4 text-center">
        {highlightTitle(title)}
      </h1>
      <p className="text-md md:text-xl text-center text-gray-400">
        {description}
      </p>
    </div>
  );
}
