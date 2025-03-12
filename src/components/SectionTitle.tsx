export default function SectionTitle({
  title,
  description,
  descriptionThin,
}: {
  title: string;
  description: string;
  descriptionThin?: string;
  textLeft?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 text-gray-900 p-24 w-full text-center`}
    >
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-4xl">
        {description}{" "}
        {descriptionThin && (
          <span className="font-thin italic">{descriptionThin}</span>
        )}
      </p>
    </div>
  );
}
