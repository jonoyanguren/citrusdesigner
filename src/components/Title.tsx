export default function Title({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-gray-900 p-24 w-full bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-regular mb-4">{title}</h1>
        <p className="text-xl">{description}</p>
      </div>
    </div>
  );
}
