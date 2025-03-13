export default function SectionTitle({
  title,
  description,
  descriptionThin,
  secondaryText,
  textLeft,
}: {
  title: string;
  description: string;
  descriptionThin?: string;
  secondaryText?: string;
  textLeft?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 text-gray-900 p-12 w-full text-center text-lg ${
        textLeft ? "text-left" : "text-center"
      }`}
    >
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-4xl">
        {description}{" "}
        {descriptionThin && (
          <span className="font-thin italic">{descriptionThin}</span>
        )}
      </p>
      <p className="text-gray-600 max-w-3xl mx-auto">{secondaryText}</p>
    </div>
  );
}
