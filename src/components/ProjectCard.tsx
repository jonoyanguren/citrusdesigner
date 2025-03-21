import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: {
    id: string;
    name: string;
  }[];
}

export default function ProjectCard({
  title,
  description,
  image,
  tags,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-xl border border-gray-300 overflow-hidden p-4">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 pr-8 text-lg mb-4 line-clamp-2">
        {description}
      </p>
      <div className="relative h-[500px] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}
