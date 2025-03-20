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
    <div className="text-gray-900 p-8 max-w-6xl mx-auto my-4">
      <h1 className="text-5xl font-bold mb-4">{highlightTitle(title)}</h1>
      <p className="text-xl">{description}</p>
    </div>
  );
}
